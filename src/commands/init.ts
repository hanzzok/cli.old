import { Command, flags } from '@oclif/command';
import { renderInit } from '../components/command/InitComponent';

export default class InitCommand extends Command {
  public static description = 'Initialize sezong.config.json';

  public static flags = {
    'block-constructors': flags.string({
      char: 'b',
      description: 'The block constructors to use',
      helpValue: 'rule1 rule2..',
      multiple: true
    }),
    decorators: flags.string({
      char: 'd',
      description: 'The decorators to use',
      helpValue: 'rule1 rule2..',
      multiple: true
    }),
    force: flags.boolean({
      char: 'f',
      description: 'Whether to ignore errors and force do initializing'
    }),
    help: flags.help({ char: 'h' }),
    platform: flags.string({
      char: 'p',
      description: 'The platform to use',
      helpValue: 'platform name'
    }),
    strict: flags.boolean({
      char: 's',
      description: 'Whether to stop with exit code when met an error'
    })
  };

  public async run() {
    const {
      flags: {
        'block-constructors': blockConstructors,
        decorators,
        force = false,
        platform,
        strict = false
      }
    } = this.parse(InitCommand);

    renderInit({
      blockConstructors,
      decorators,
      force,
      platform,
      strict
    });
  }
}
