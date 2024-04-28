import chalk from "chalk";
import { Authenticator } from "./Authenticator";

export class System {
    static printInfo() {
        console.clear()
        console.log(`
            ${chalk.green('--------------------------------------')}
            ${chalk.green('      Proyecto Granjas de Chile       ')}
            ${chalk.green('--------------------------------------')}

            ${chalk.green('Initialized services:')}
            ${chalk.green('Authenticator:')} ${Authenticator.initialized ? chalk.green('✅') : chalk.red('❌')}

        `)
    }
}