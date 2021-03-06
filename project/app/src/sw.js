/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
importScripts('workbox-sw.dev.v2.0.0.js');
importScripts('workbox-background-sync.dev.v2.0.0.js');

const workboxSW = new WorkboxSW();
workboxSW.precache([]);

let bgQueue = new workbox.backgroundSync.QueuePlugin({
  callbacks: {
    replayDidSucceed: async(hash, res) => {
      self.registration.showNotification('Background sync demo', {
        body: 'Events have been updated!'
      });
    }
  }
});

workboxSW.router.registerRoute('/api/add',
  workboxSW.strategies.networkOnly({plugins: [bgQueue]}), 'POST'
);
workboxSW.router.registerRoute('/api/delete',
  workboxSW.strategies.networkOnly({plugins: [bgQueue]}), 'DELETE'
);
workboxSW.router.registerRoute('/api/getAll', () => {
  return bgQueue.replayRequests().then(() => {
    return fetch('/api/getAll');
  }).catch(err => {
    return err;
  });
});
