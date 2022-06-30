import fs from 'fs';
import { create, globSource } from 'ipfs-http-client';
import {
  INFURA_PROJECT_ID,
  INFURA_PROJECT_SECRET,
} from './config.local.mjs';

const authorization = 'Basic ' + Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_PROJECT_SECRET).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  protocol: 'https',
  port: 5001,
  path: '/api/v0',
  headers: {
    authorization,
  },
});

const uploaded = {};

const uploadFile = async (content) => {
  const hash = await client.add({ content });
  return hash;
};

const files = fs.readdirSync('./files/');
files.forEach((file) => {
  if (!['.DS_Store', '.gitkeep'].includes(file)) {
    const content = fs.readFileSync(`./files/${file}`, 'utf-8');
    uploadFile(content).then((hash) => {
      uploaded[file] = hash.path;
      console.log(`Uploaded '${file}': ${hash.path}`);
    });
  }
});

fs.writeFileSync('./uploaded.json', JSON.stringify(uploaded));
