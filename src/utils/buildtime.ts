/* this file runs at buildtime. it should not contain any functions actively used by the website. */

import fs from 'fs-extra';
import { getLocaleList } from './locale.ts';

const filename = './public/assets/json/localeList.json';

fs.ensureFileSync(filename);

const localeList = getLocaleList();

fs.writeFileSync(filename, JSON.stringify(localeList, null, '\t'));
