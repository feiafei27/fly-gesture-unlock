import Anchor, { AnchorDefine, Location } from './anchor';
import Utils from './utils';

/**
 * 手势解锁渲染器
 * 泛型 ExtraStatus 意为：除 'selected' 和 'not-selected' 外的额外状态，如果没有额外状态的话，可以传递 never；
 * 当需要渲染绘制失败等额外状态时，则需要定义该泛型，并定义好对应的样式；
 */
export default class GestureUnlockRenderer<ExtraStatus extends string> {
  // 容器 DOM
  container: HTMLElement | null;
  // Canvas 元素
  canvas: HTMLCanvasElement;
  // Canvas 渲染上下文
  ctx: CanvasRenderingContext2D;
  
  // 锚点的样式
  anchorStatusStyles: AnchorStatusStyles<ExtraStatus>;
  // 连线的样式
  lineStatusStyles: LineStatusStyles<ExtraStatus>;
  // 事件回调配置
  events?: Events<ExtraStatus>;
  // 默认配置
  defaultConfig: Config = {
    arrow: {
      show: true,
      size: 5,
      distance: 16,
    },
    isLineCoverAnchor: false,
    isLineAutoSelect: false,
    isAnchorRepeatSelect: false,
  };
  // 业务方面的配置
  config: Config = this.defaultConfig;

  // 锚点实例数组
  private anchors: Anchor<ExtraStatus>[];
  // 存储选中的锚点
  private selectedAnchors: Anchor<ExtraStatus>[] = [];

  // 选中相邻锚点之间连线的状态
  private lineStatus: LineRequireStatus | ExtraStatus = 'normal';
  
  // 标识当前是不是冻结状态
  private _freeze = false;
  // 标识当前是不是绘制中
  private _drawing = false;

  constructor({
    container,
    anchorDefines,
    anchorStatusStyles,
    lineStatusStyles,
    events,
    config,
  }: RendererOptions<ExtraStatus>) {
    // 获取 container div 元素
    this.container =
      typeof container === 'string'
        ? document.getElementById(container)
        : container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.anchorStatusStyles = anchorStatusStyles;
    this.lineStatusStyles = lineStatusStyles;

    this.events = events;

    Object.assign(this.config, config ?? {});

    // 处理 DOM 相关
    this.handleDOM(this.container, this.canvas, this.ctx);
    
    // 绑定相关事件
    this.bindEvents();

    // 创建锚点实例
    this.anchors = anchorDefines.map(anchorDefine => new Anchor<ExtraStatus>(anchorDefine, this));

    // 进行一次绘制
    this.render();
  }

  /**
   * 根据当前的数据进行一帧的绘制
   */
  private render(e?: TouchEvent | MouseEvent) {
    const { isLineCoverAnchor } = this.config;
    // 每一帧绘制前都需要先清空整个画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (!isLineCoverAnchor) {
      // 绘制选中相邻锚点之间的连线
      this.drawAnchorLine();
      // 绘制最后一个选中锚点和鼠标手指位置之间的连线
      if (e && this._drawing) {
        this.drawLastAnchorMouseLine(e);
      }
    }

    // 绘制锚点
    this.anchors.forEach(anchor => anchor.render(this.ctx));
    
    if (isLineCoverAnchor) {
      // 绘制选中相邻锚点之间的连线
      this.drawAnchorLine();
      // 绘制最后一个选中锚点和鼠标手指位置之间的连线
      if (e && this._drawing) {
        this.drawLastAnchorMouseLine(e);
      }
    }
    
    // 绘制选中相邻锚点之间的箭头
    this.drawAnchorArrow();
  }
  
  /**
   * 绑定相关事件
   */
  private bindEvents() {
    this.canvas.addEventListener('touchstart', e => this.handleEvent(e, 'start'));
    this.canvas.addEventListener('mousedown', e => this.handleEvent(e, 'start'));
    
    this.canvas.addEventListener('touchmove', e => this.handleEvent(e, 'move'));
    this.canvas.addEventListener('mousemove', e => this.handleEvent(e, 'move'));
    
    this.canvas.addEventListener('touchend', e => this.handleEvent(e, 'end'));
    this.canvas.addEventListener('mouseup', e => this.handleEvent(e, 'end'));

    this.canvas.addEventListener('mouseleave', e => this.handleEvent(e, 'leave'));
  }
  
  /**
   * 绘制选中相邻锚点之间的连线
   */
  private drawAnchorLine() {
    // 先根据当前的 lineStatus 获取对应的 line 样式
    const { lineWidth, lineColor } = this.lineStatusStyles[this.lineStatus];
    // 设置渲染上下文
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = lineColor;
    // 遍历已选中的锚点进行绘制
    this.selectedAnchors.forEach((anchor, index, arr) => {
      const nextAnchor = arr[index + 1];
      // 如果当前锚点没有下一个锚点的话，则不需要连线
      if (!nextAnchor) return;
      // 获取两个锚点圆心的位置
      const { location: l1 } = anchor;
      const { location: l2 } = nextAnchor;
      // 进行直线的绘制
      this.drawTwoLocationLine(l1, l2);
    })
  }

  /**
   * 绘制选中相邻锚点之间连线上面的箭头
   */
  private drawAnchorArrow() {
    // 先根据当前的 lineStatus 获取对应的 line 样式
    const { lineWidth, lineColor } = this.lineStatusStyles[this.lineStatus];
    // 设置渲染上下文
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = lineColor;
    // 遍历已选中的锚点进行绘制
    this.selectedAnchors.forEach((anchor, index, arr) => {
      const nextAnchor = arr[index + 1];
      // 如果当前锚点没有下一个锚点的话，则不需要连线
      if (!nextAnchor) return;
      // 进行箭头的绘制操作
      if (this.config.arrow.show) this.drawArrow(anchor, nextAnchor);
    })
  }
  
  /**
   * 绘制最后一个选中锚点和鼠标手指位置之间的连线
   */
  private drawLastAnchorMouseLine(e: TouchEvent | MouseEvent) {
    const lastAnchor = this.selectedAnchors[this.selectedAnchors.length - 1];
    if (!lastAnchor) return;
    const location = this.gainMouseTouchLocation(e);
    this.drawTwoLocationLine(lastAnchor.location, location);
  }
  
  /**
   * 绘制两点之间的连线
   */
  private drawTwoLocationLine(l1: Location, l2: Location) {
    this.ctx.beginPath();
    this.ctx.moveTo(l1.x, l1.y);
    this.ctx.lineTo(l2.x, l2.y);
    this.ctx.stroke();
  }
  
  /**
   * 绘制箭头
   */
  private drawArrow(anchor: Anchor<ExtraStatus>, nextAnchor: Anchor<ExtraStatus>) {
    const { location: l1, arrow } = anchor;
    const { location: l2 } = nextAnchor;
    const { ctx } = this;
    // 优先使用锚点中的箭头配置，如果没有的话，使用全局的箭头配置
    // 箭头距离 l1 距离的远近（辅助圆圆心距离 l1 的远近）
    const tl1Distance = arrow?.distance ?? this.config.arrow.distance;
    // 箭头的大小（辅助圆的半径）
    const auxRadius = arrow?.size ?? this.config.arrow.size;
    
    // 先计算直角对应点的坐标
    // 两点的距离
    const d = Utils.distance(l1, l2);
    // 计算圆心，利用圆这个几何模型计算出想要直角形的三个点
    const cx = l1.x + tl1Distance * ((l2.x - l1.x) / d);
    const cy = l1.y + tl1Distance * ((l2.y - l1.y) / d);
    
    // 先找出直角对应的点
    const l1x = l1.x + (tl1Distance + auxRadius) * ((l2.x - l1.x) / d);
    const l1y = l1.y + (tl1Distance + auxRadius) * ((l2.y - l1.y) / d);
    
    // 定义另外两点（45度角对应的点）的坐标
    let l2x, l2y, l3x, l3y;
    
    if (l1.x === l2.x) {
      // 1：如果连线是垂直的话
      l2x = cx - auxRadius;
      l2y = cy;
      l3x = cx + auxRadius;
      l3y = cy;
    } else if (l1.y === l2.y) {
      // 2：如果连线是水平的话
      l2x = cx;
      l2y = cy - auxRadius;
      l3x = cx;
      l3y = cy + auxRadius;
    } else {
      // 3：连线既不水平也不垂直
      // 先计算 l1 到 l2 直线的斜率
      const m = (l2.y - l1.y) / (l2.x - l1.x);
      // 然后有一个新的辅助线，这条线穿过圆心，并且垂直于 l1 到 l2 的直线
      // 辅助线的斜率
      const luxLineM = -1 / m;
      // 辅助线的截距
      const luxLineB = cy - luxLineM * cx;
      const result = Utils.getIntersectionPoints(luxLineM, luxLineB, cx, cy, auxRadius);
      if (result?.length === 2) {
        l2x = result[0][0];
        l2y = result[0][1];
        l3x = result[1][0];
        l3y = result[1][1];
      } else {
        l2x = l2y = l3x = l3y = 0;
      }
    }
    
    // 绘制箭头
    ctx.beginPath();
    ctx.moveTo(l1x, l1y);
    ctx.lineTo(l2x, l2y);
    ctx.lineTo(l3x, l3y);
    ctx.closePath();
    ctx.fillStyle = this.lineStatusStyles[this.lineStatus].lineColor;
    ctx.fill();
  }

  /**
   * 设置当前的状态，注意这里只能设置额外的状态，例如：设置成 'error' 状态；
   * @param extraStatus
   */
  public setStatus(extraStatus: ExtraStatus) {
    if (!extraStatus) return;
    // 接口只允许设置额外状态
    if (['not-selected', 'selected'].includes(extraStatus)) {
      console.log('setStatus 方法只允许设置额外状态，不允许设置 not-selected 以及 selected，不会进行任何操作！');
      return;
    }
    // 判断有没有对应的样式，没有的话，不进行任何操作
    if (!this.anchorStatusStyles[extraStatus]) {
      console.error(`没有定义 ${extraStatus} 状态的 anchorStatusStyles，不会进行任何操作！`);
      return;
    }
    if (!this.lineStatusStyles[extraStatus]) {
      console.error(`没有定义 ${extraStatus} 状态的 lineStatusStyles，不会进行任何操作！`);
      return;
    }
    // 如果当前没有选中节点的话，没必要执行切换状态的操作
    if (!this.selectedAnchors.length) {
      console.error('没有选中的锚点，不进行任何操作！');
      return;
    }
    this.lineStatus = extraStatus;
    this.selectedAnchors.forEach(anchor => anchor.setStatus(extraStatus));
    // 进行一次绘制
    this.render();
  }

  /**
   * 处理 DOM 相关
   * @param container 容器 DOM 元素
   * @param canvas canvas 元素
   * @param ctx 渲染上下文
   * @private
   */
  private handleDOM(container: HTMLElement | null, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null) {
    if (!container) console.error('Unable to obtain container element');
    if (!ctx) console.error('Unable to obtain CanvasRenderingContext2D');
    if (!container || !ctx) return;

    // 设置 canvas
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // 设置 style 样式
    canvas.style.cursor = 'pointer';

    // 将 canvas 添加到 container 中
    container.appendChild(canvas);

    // 处理 Canvas 在高分屏上渲染模糊的问题
    Utils.handleHighDprVague(canvas, ctx);
  }
  
  /**
   * 处理事件
   */
  private handleEvent(e: TouchEvent | MouseEvent, type: 'start' | 'move' | 'end' | 'leave') {
    e.preventDefault();
    if (this._freeze) return;
    
    type === 'start' && this.handleStart(e);
    type === 'move' && this.handleMove(e);
    type === 'end' && this.handleEnd();
    type === 'leave' && this.handleLeave();
  }
  
  /**
   * 开始 event
   */
  private handleStart(e: TouchEvent | MouseEvent) {
    const location = this.gainMouseTouchLocation(e);
    const selectedAnchor = this.containLocationAnchor(location);
    // 如果当前选中的有锚点的话
    if (selectedAnchor) {
      this._drawing = true;
      this.reset();
    }
    this.pickAnchorUpdateData(location, 'start');
    this.render(e);
  }
  
  /**
   * 移动中 event
   */
  private handleMove(e: TouchEvent | MouseEvent) {
    if (!this._drawing) return;
    const location = this.gainMouseTouchLocation(e);
    this.pickAnchorUpdateData(location, 'move');
    this.render(e);
  }
  
  /**
   * 结束 event
   */
  private handleEnd() {
    if (this._drawing) {
      this.events?.['end']?.(this.selectedAnchors);
    }
    this._drawing = false;
    this.render();
  }

  /**
   * 鼠标或者手指移出 Canvas 面板
   */
  private handleLeave() {
    this.handleEnd();
  }

  /**
   * 重置渲染器为初始状态
   */
  public reset() {
    // 清空选中的锚点
    this.selectedAnchors = [];
    // 重置 lineStatus
    this.lineStatus = 'normal';
    // 重置各个锚点的状态
    this.anchors.forEach(anchor => anchor.setStatus('not-selected'));
    // 进行一帧的绘制
    this.render();
  }
  
  /**
   * 判断当前的位置有没有选中锚点，有的话，进行相关数据的维护以及其他逻辑
   */
  private pickAnchorUpdateData(location: Location, type: 'start' | 'move') {
    const newAnchor = this.containLocationAnchor(location);
    if (
      newAnchor
      // 如果当前允许重复选的话 ？ 当前新选的和最后选择的锚点不一样就可以了 : 当前新选的还没有被选择过
      && (this.config.isAnchorRepeatSelect ? this.lastSelectedAnchor?.id !== newAnchor.id : !this.selectedAnchors.includes(newAnchor))
    ) {
      // 处理 isLineAutoSelect 逻辑，处理自动选中锚点的逻辑
      if (this.config.isLineAutoSelect && this.lastSelectedAnchor) {
        // 过滤获取自动选中的锚点
        const autoSelectAnchors = this.anchors.filter(anchor => {
          // 如果 anchor 锚点是最后选中的锚点和当前选中的锚点的话，直接 return false
          if ([this.lastSelectedAnchor.id, newAnchor.id].includes(anchor.id)) return false;
          
          // 如果当前不允许重复选并且 anchor 已经被选中过了的话，直接 return false
          if (!this.config.isAnchorRepeatSelect && this.selectedAnchors.includes(anchor)) return false;
          
          // 判断两点连成的线段是否经过 anchor 锚点
          return Utils.isLineSegmentIntersectingCircle(
            { start: this.lastSelectedAnchor.location, end: newAnchor.location },
            { center: anchor.location, radius: anchor.anchorCircleRadius },
          );
        }).sort((anchor1, anchor2) => {
          // 根据距离 lastSelectedAnchor 的距离进行排序，距离近的在前面
          const { location: originLocation } = this.lastSelectedAnchor;
          return Utils.distance(originLocation, anchor1.location) - Utils.distance(originLocation, anchor2.location);
        });
        // 如果有自动选择选中锚点的话，进行相关数据的维护
        if (autoSelectAnchors?.length) {
          autoSelectAnchors.forEach(anchor => anchor.setStatus('selected'));
          this.selectedAnchors.push(...autoSelectAnchors);
        }
      }
      
      // 下面的代码用于维护 newAnchor
      // 变更锚点的状态
      newAnchor.setStatus('selected');
      // 维护已选择锚点的数组
      this.selectedAnchors.push(newAnchor);
      // 执行回调函数
      this.events?.[type === 'start' ? 'start' : 'update']?.(this.selectedAnchors);
    }
  }
  
  /**
   * 获取鼠标或者手指在 Canvas 上的定位
   */
  private gainMouseTouchLocation(e: TouchEvent | MouseEvent): Location {
    let x, y;
    const { top, left } = this.canvas.getBoundingClientRect();
    if ('clientX' in e) {
      x = e.clientX - left;
      y = e.clientY - top;
    } else {
      x = e.changedTouches[0].pageX - left;
      y = e.changedTouches[0].pageY - top;
    }
    return {
      x,
      y,
    };
  }
  
  /**
   * 根据当前鼠标或者手指的 location，寻找包含这个 location 的锚点
   */
  private containLocationAnchor(location: Location) {
    return this.anchors.find(anchor => Utils.distance(location, anchor.location) < anchor.anchorCircleRadius);
  }
  
  /**
   * 冻结面板
   */
  public freeze() {
    this._freeze = true;
  }
  
  /**
   * 解冻面板
   */
  public unFreeze() {
    this._freeze = false;
  }
  
  /**
   * 当容器尺寸发生变化时，调用此方法对渲染器进行 resize
   */
  public resize(anchorDefines: AnchorDefine[], config: Partial<Config> = {}) {
    // 设置 config
    Object.assign(this.config, config);
    
    // 重新设置 Canvas 宽高
    this.canvas.width = this.container?.clientWidth ?? 0;
    this.canvas.height = this.container?.clientHeight ?? 0;
    
    // 处理 Canvas 在高分屏上渲染模糊的问题
    Utils.handleHighDprVague(this.canvas, this.ctx);
    
    // 相关数据处理
    const oldAnchorInstances = this.anchors;
    this.anchors = anchorDefines.map(anchorDefine => new Anchor<ExtraStatus>(anchorDefine, this));
    
    // 遍历设置新锚点实例的状态
    this.anchors.forEach(newAnchor => {
      // 寻找和新锚点对应的旧锚点，以 id 为标识
      const oldAnchor = oldAnchorInstances.find(item => item.id === newAnchor.id);
      // 如果能找到的话，设置状态
      if (oldAnchor) newAnchor.status = oldAnchor.status;
    });
    
    // 重新填充 selectedAnchors
    this.selectedAnchors = this.selectedAnchors.map(oldAnchor => {
      return this.anchors.find(item => item.id === oldAnchor.id);
    }).filter(anchor => !!anchor) as Anchor<ExtraStatus>[];
    
    // 进行一次绘制
    this.render();
  }

  /**
   * 获取当前选中的最后一个锚点
   */
  private get lastSelectedAnchor() {
    return this.selectedAnchors[this.selectedAnchors.length - 1];
  }

  /**
   * 用于生成常规锚点方阵的辅助函数
   * @param canvasSize 定义 canvas 的宽和高；
   * @param padding 定义锚点方阵距离 canvas 四边的内边距；
   * @param matrix 定义锚点方阵有几行几列，一共会生成 row * column 个锚点；
   * @param anchor 定义锚点的相关属性；
   * @param customId 用于自定义 id 的函数，会传入当前锚点是第几行第几列；
   */
  static AnchorMatrixFactory({
    canvasSize, padding, matrix, anchor, customId,
  }: MatrixFactoryOptions): AnchorDefine[] {
    const anchorDefines: AnchorDefine[] = [];
    const { width, height } = canvasSize;
    let top, right, bottom, left;
    if (typeof padding === 'number') {
      top = right = bottom = left = padding;
    } else {
      top = padding.top;
      right = padding.right;
      bottom = padding.bottom;
      left = padding.left;
    }
    const { row, column } = matrix;
    const { anchorCircleRadius, centerCircleRadius } = anchor;

    // 极限 row、column 处理

    // 计算行以及列之间的间距
    const rowSpace = (height - top - bottom - 2 * anchorCircleRadius * row) / (row - 1);
    const columnSpace = (width - left - right - 2 * anchorCircleRadius * column) / (column - 1);

    // 自增 id
    let incId = 1;

    for (let i = 1; i <= row; i++) {
      for (let j = 1; j <= column; j++) {
        // 生成第 i 行，第 j 列的锚点
        anchorDefines.push({
          id: customId ? customId(i, j) : (incId++).toString(),

          location: {
            x: left + anchorCircleRadius + (j - 1) * (2 * anchorCircleRadius + columnSpace),
            y: top + anchorCircleRadius + (i - 1) * (2 * anchorCircleRadius + rowSpace),
          },

          anchorCircleRadius,
          centerCircleRadius,
        });
      }
    }

    return anchorDefines;
  }
}

/**
 * GestureUnlockRenderer class 构造函数的参数
 */
export type RendererOptions<ExtraStatus extends string> = {
  // 容器 DOM
  container: string | HTMLElement;
  // 锚点配置项
  anchorDefines: AnchorDefine[];

  // 定义锚点各个状态的样式（因为锚点各个状态的样式是相同的，所以放在这里进行统一配置）
  anchorStatusStyles: AnchorStatusStyles<ExtraStatus>;
  // 定义锚点之间的连线各个状态的样式
  lineStatusStyles: LineStatusStyles<ExtraStatus>;

  // 事件回调
  events?: Events<ExtraStatus>;

  // 用于配置业务方面的各种细节
  config?: Partial<Config>;
}

/**
 * 配置业务方面的各种细节
 */
export type Config = {
  // 用于配置箭头
  arrow: Arrow,
  // 用于控制连线是否会遮挡锚点
  isLineCoverAnchor: boolean;
  // 用于控制选中两个锚点的时候，其线段所经过的锚点会不会被自动选中
  isLineAutoSelect: boolean;
  // 用于控制锚点是否能够被重复选中
  isAnchorRepeatSelect: boolean;
}

/**
 * 完整的箭头配置
 */
export type Arrow = {
  // 用于控制是否渲染连线上面的箭头
  show: boolean;
  // 用于控制箭头的大小
  size: number;
  // 用于控制箭头距离起始锚点的距离
  distance: number;
}

/**
 * 锚点中的箭头配置
 */
export type AnchorArrow = Partial<Omit<Arrow, 'show'>>;

/*
* start：开始绘制时；
* update：有新的锚点被选中时；
* end：绘制完成时；
* */
export type EventName = 'start' | 'update' | 'end';

export type Events<ExtraStatus extends string> = {
  [key in EventName]?: (anchors: Anchor<ExtraStatus>[]) => void
};

/**
 * 连线必须有的状态类型
 */
export type LineRequireStatus = 'normal';

/**
 * 定义锚点连线各个状态的样式
 */
export type LineStatusStyles<ExtraStatus extends string> = {
  [K in (LineRequireStatus | ExtraStatus)]: LineStyle;
};

/**
 * 连线某一个状态的样式
 */
export type LineStyle = {
  lineColor: string;
  lineWidth: number;
}

/**
 * 锚点必须有的两个状态类型
 */
export type AnchorRequireStatus = 'not-selected' | 'selected';

/**
 * 锚点各个状态的样式
 */
export type AnchorStatusStyles<ExtraStatus extends string> = {
  [K in (AnchorRequireStatus | ExtraStatus)]: AnchorStyle;
};

/**
 * 锚点某一个状态的样式
 */
export type AnchorStyle = {
  // 锚点圆的边框宽、边框颜色、填充颜色、阴影
  anchorCircleBorderWidth?: number;
  anchorCircleBorderColor?: string;
  anchorCircleFillColor?: string;
  anchorCircleShadowColor?: string;
  anchorCircleShadowBlur?: number;
  anchorCircleShadowOffsetX?: number;
  anchorCircleShadowOffsetY?: number;

  // 中心圆的边框宽、边框颜色、填充颜色、阴影
  centerCircleBorderWidth?: number;
  centerCircleBorderColor?: string;
  centerCircleFillColor?: string;
  centerCircleShadowColor?: string;
  centerCircleShadowBlur?: number;
  centerCircleShadowOffsetX?: number;
  centerCircleShadowOffsetY?: number;
}

/**
 * AnchorMatrixFactory 函数参数类型
 */
export type MatrixFactoryOptions = {
  // 定义 canvas 的宽和高；
  canvasSize: { width: number; height: number; };
  // 定义锚点方阵距离 canvas 四边的内边距；
  padding: { top: number, right: number; bottom: number; left: number } | number;
  // 定义锚点方阵有几行几列，一共会生成 row * column 个锚点；
  matrix: { row: number; column: number };
  // 定义锚点的相关属性；
  anchor: { anchorCircleRadius: number; centerCircleRadius: number; };
  // 用于自定义 id 的函数，会传入当前锚点是第几行第几列；
  customId?: (row: number, column: number) => string;
}

export * from './anchor';

export {
  Anchor,
}
