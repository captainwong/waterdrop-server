import { parse } from 'node-html-parser';
import path = require('path');
import * as fs from 'node:fs';
import { Buffer } from 'node:buffer';

const html = fs.readFileSync(path.join(__dirname, 'teachers.html'), 'utf8');

const root = parse(html);

const teachers = root.querySelectorAll('h4');

// teachers = teachers.slice(0, 1);

interface ITeacher {
  name: string;
  photo: string;
  ali?: string;
  desc: string;
}

const theTeachers: ITeacher[] = [];

teachers.forEach((teacher) => {
  // console.log(typeof teacher);
  const strong = teacher.querySelector('strong');
  // console.log(strong.rawText);

  let name = strong.rawText;
  try {
    name = strong.rawText.split('：')[1].split('（')[0];
  } catch {
    name = strong.rawText.split(':')[1].split('(')[0];
  }
  //console.log(name);
  const p = teacher.nextElementSibling;
  const img = p.querySelector('img').getAttribute('src');
  //console.log(img.split('?')[0]);

  const desc = p.nextElementSibling.nextElementSibling;
  //console.log(desc.rawText.trim().replace(/\&nbsp;/g, ' '));
  //console.log('\n');

  theTeachers.push({
    name,
    photo: img.split('?')[0],
    desc: desc.rawText.trim().replace(/\&nbsp;/g, ' '),
  });
});

console.log(JSON.stringify(theTeachers, null, 2));

const download = (url: string, path: string) => {
  return fetch(url)
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((buf: ArrayBuffer) => {
      fs.writeFile(path, Buffer.from(buf), (err) => {
        if (err) throw err;
        console.log(url, path);
      });
    })
    .catch((e) => {
      console.log('error downloading ' + url, e);
    });
};

async function fetchImgs() {
  const ds = [];
  for (let i = 0; i < theTeachers.length; i += 1) {
    const teacher = theTeachers[i];
    const { name, photo, desc } = teacher;
    const filePath = `./tools/images/${name}.jpg`;
    ds.push(download(photo, filePath));
    teacher.ali =
      'https://waterdrop-server-assets.oss-cn-zhangjiakou.aliyuncs.com/teachers/' +
      name +
      '.jpg';
  }

  await Promise.all(ds)
    .then(() => {
      fs.writeFileSync(
        './tools/images/teachers.json',
        JSON.stringify(theTeachers, null, 2),
      );
    })
    .catch((e) => {
      console.log(e);
    });
}

fetchImgs();
