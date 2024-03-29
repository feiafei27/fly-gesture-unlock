// 发布新版本库的脚本
/**
 * minimist
 * chalk
 * semver
 * enquirer
 * execa
 */
import fs from 'fs';
import { execa } from 'execa';
import enquirer from 'enquirer';
import semver from 'semver';
import pico from 'picocolors';

// 当前的版本号
const packageString = fs.readFileSync('./package.json', 'utf8');
const packageJson = JSON.parse(packageString);
const currentVersion = packageJson.version;

const versionIncrements = [
  'patch',
  'minor',
  'major',
];

const inc = i => semver.inc(currentVersion, i);
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });
const stepStart = msg => console.log(pico.cyan(msg));
const stepEnd = msg => console.log(pico.green(msg));

async function main() {
  let targetVersion = '';

  // 1：执行打包 build
  stepStart('执行打包...');
  await run('npm', ['run', 'build:lib']);
  stepEnd('打包完成');

  // 2：变更 version 号
  const { release } = await enquirer.prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
  })

  if (release === 'custom') {
    targetVersion = (
      await enquirer.prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion
      })
    ).version;
  } else {
    targetVersion = release.match(/\((.*)\)/)[1]
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  const { yes } = await enquirer.prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  })

  if (!yes) return;
  updateVersions(targetVersion);

  // 3：npm 发布
  stepStart('发布 npm ...');
  await run('npm', ['publish', '--registry', 'https://registry.npmjs.org']);
  stepEnd('发布成功');

  // 4：push 代码仓库
  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    stepStart('推送代码仓库 ...');
    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `release: v${targetVersion}`]);

    await run('git', ['tag', `v${targetVersion}`]);

    const remotes = [
      'git@github.com:feiafei27/fly-gesture-unlock.git',
      'https://gitee.com/fei_fei27/fly-gesture-unlock.git',
    ];
    await Promise.all(remotes.map(remote => run('git', ['push', remote, `refs/tags/v${targetVersion}`])));
    await Promise.all(remotes.map(remote => run('git', ['push', remote])));
    stepEnd('推送成功');
  } else {
    console.log('No changes to commit.')
  }
}

function updateVersions(version) {
  packageJson.version = version;
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
}

main().catch(err => {
  // 恢复之前的版本号
  updateVersions(currentVersion);
  console.log(err);
})