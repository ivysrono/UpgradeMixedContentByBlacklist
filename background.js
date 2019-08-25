/*
    Modify the CSP
    Copyright (C) 2016 Pascal Ernster
    Copyright (C) 2017 ghost
    Copyright (C) 2019 ivysrono

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
'use strict';

let buildin_list = [
  'https://feedly.com/',
  'https://newsblur.com/',
  'https://www.newsblur.com/',
  'https://theoldreader.com/',
  'https://www.yilan.io/',

  'https://home.baidu.com/',
  'https://www.bianews.com/',
  'https://www.cnblogs.com/qianguyihao/',
  'https://coolapk.com/apk/',
  'https://www.coolapk.com/apk/',
  'https://potplayer.daum.net/',
  'https://www.gokgs.com/',
  'https://w.huanqiu.com/r/',
  'https://bbs.kafan.cn/thread-2102542-6-1.html',
  'https://www.leikeji.com/',
  'https://www.lihua.com/',
  'https://www.qdaily.com/',
  'https://m.qdaily.com/',
  'https://y.qq.com/',
  'https://www.v2ex.com/t/462280',
  'https://baoming.yikeweiqi.com/'
];

let blacklist = localStorage;

function modifyCSP(e) {
  // Look up backlist
  let uri = document.createElement('a');
  uri.href = e.url;

  //if (document.getElementById('buildin_checkbox').checked) {
  for (let buildin of buildin_list) {
    if (uri.href.startsWith(buildin)) {
      return;
    }
  }
  //}

  if (Number(blacklist[uri.hostname]) === 1) {
    return;
  }
  for (let black in blacklist) {
    if (uri.href.startsWith(black)) {
      return;
    }
  }

  let CSPMissing = true;
  for (let header of e.responseHeaders) {
    if (header.name.toLowerCase() === 'content-security-policy') {
      if (typeof header.value === 'string') {
        if (header.value.search('upgrade-insecure-requests') === -1) {
          header.value += ';upgrade-insecure-requests';
          CSPMissing = false;
        }
      }
    }
  }
  if (CSPMissing) {
    e.responseHeaders.push({ name: 'content-security-policy', value: 'upgrade-insecure-requests' });
  }
  return { responseHeaders: e.responseHeaders };
}

chrome.webRequest.onHeadersReceived.addListener(
  modifyCSP,
  { urls: ['https://*/*'], types: ['main_frame', 'sub_frame'] },
  ['blocking', 'responseHeaders']
);
