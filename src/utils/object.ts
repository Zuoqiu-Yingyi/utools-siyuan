export {
    copy,
    merge,
    is,
    isObject,
    isArray,
};

import { unref, toRaw } from "vue";

// REF [js - 对象递归合并merge - zc-lee - 博客园](https://www.cnblogs.com/zc-lee/p/15873611.html)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = Record<string | number, any>;

function is(obj: Obj, name: string): boolean {
    return Object.prototype.toString.call(obj) === `[object ${name}]`;
}

function isObject(obj: Obj): boolean {
    return is(obj, "Object");
}

function isURL(obj: Obj): boolean {
    return is(obj, "URL");
}

function isProxy(obj: Obj): boolean {
    return is(obj, "Proxy");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArray(arr: any[]): boolean {
    return Array.isArray(arr);
}

function merge(target: Obj, ...arg: Obj[]): Obj {
    return arg.reduce((acc, cur) => {
        return Object.keys(cur).reduce((subAcc, key) => {
            const srcVal = unref(cur[key]);
            if (isObject(srcVal)) {
                subAcc[key] = merge(subAcc[key] ? subAcc[key] : {}, srcVal);
            } else if (isArray(srcVal)) {
                // series: []，下层数组直接赋值
                subAcc[key] = srcVal.map((item: Obj, idx: string | number) => {
                    switch (true) {
                        case isObject(item): {
                            const curAccVal = subAcc[key] ? subAcc[key] : [];
                            return merge(curAccVal[idx] ? curAccVal[idx] : {}, unref(item));
                        }
                        case isURL(item):
                            return new URL(item.toString());
                        default:
                            return item;
                    }
                })
            } else {
                subAcc[key] = srcVal;
            }
            return subAcc;
        }, acc);
    }, target);
}

function copy<T extends Obj>(obj: T): T {
    return merge({}, toRaw(obj)) as T;
}
