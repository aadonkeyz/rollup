import path from 'path';

import rollupCli from '../cli/cli';

const fileName = path.resolve(__dirname, 'rollup.config.ts');

rollupCli(fileName);
