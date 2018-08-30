/*
Copyright 2016 LinkedIn Corp. Licensed under the Apache License,
Version 2.0 (the "License"); you may not use this file except in
compliance with the License. You may obtain a copy of the License
at http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*/
import { SpanielObserver } from './native-spaniel-observer';
function onEntry(entries) {
    entries.forEach(function (entry) {
        var label = entry.label, duration = entry.duration, boundingClientRect = entry.boundingClientRect;
        var opts = {
            duration: duration,
            boundingClientRect: boundingClientRect
        };
        if (entry.entering) {
            entry.payload.callback(label, opts);
        }
        else if (entry.label === 'impressed') {
            opts.visibleTime = entry.time - entry.duration;
            entry.payload.callback('impression-complete', opts);
        }
    });
}
var Watcher = /** @class */ (function () {
    function Watcher(ObserverClass, config) {
        if (config === void 0) { config = {}; }
        var time = config.time, ratio = config.ratio, rootMargin = config.rootMargin, root = config.root;
        var threshold = [
            {
                label: 'exposed',
                time: 0,
                ratio: 0
            }
        ];
        if (time) {
            threshold.push({
                label: 'impressed',
                time: time,
                ratio: ratio || 0
            });
        }
        if (ratio) {
            threshold.push({
                label: 'visible',
                time: 0,
                ratio: ratio
            });
        }
        this.observer = new SpanielObserver(ObserverClass, onEntry, {
            rootMargin: rootMargin,
            threshold: threshold,
            root: root
        });
    }
    Watcher.prototype.watch = function (el, callback) {
        this.observer.observe(el, {
            callback: callback
        });
    };
    Watcher.prototype.unwatch = function (el) {
        this.observer.unobserve(el);
    };
    Watcher.prototype.disconnect = function () {
        this.observer.disconnect();
    };
    return Watcher;
}());
export { Watcher };
//# sourceMappingURL=native-watcher.js.map