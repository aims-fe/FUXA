import LocationSearch from "./LocationSearch";

interface MeasureMsg {
    equipmentCode: string;
    measureCode: string;
    timestamp: string;
    props: MeasurePropMsg[];
}

interface MeasurePropMsg {
    propCode: string;
    propValue: string;
}

function forEachRealtime(realtime, callback) {
    (realtime?.measureRealtimeData || []).forEach(
        ({ equipmentCode, measureCode, timestamp: time, props }) => {
            const ids = genEquipmentIds(equipmentCode);
            props.forEach(({ propValue, propCode }) => {
                const timestamp = formatTime(time);
                ids.forEach((equipId) => {
                    const id = genEquipMeasureId(
                        equipId,
                        measureCode,
                        propCode
                    );
                    callback({ id, timestamp, value: propValue });
                });
            });
        }
    );
    (realtime?.metricRealtimeData || []).forEach(
        ({ equipmentCode, metricCode, label }) => {
            const ids = genEquipmentIds(equipmentCode);
            const timestamp = formatTime(label.timestamp);
            ids.forEach((equipId) => {
                const id = genEquipmetricId(equipId, metricCode);
                callback({ id, timestamp, value: label.value });
            });
        }
    );

    (realtime?.statusRealtimeData || []).forEach(
        ({ equipmentCode, statusCode, changeTime, valueDesc }) => {
            const ids = genEquipmentIds(equipmentCode);
            const timestamp = formatTime(changeTime);
            ids.forEach((equipId) => {
                const id = genEquipstatusId(equipId, statusCode);
                callback({ id, timestamp, value: valueDesc });
            });
        }
    );
}

function forEachMeasureMsg(msg: MeasureMsg[], callback) {
    (msg || []).forEach(
        ({ equipmentCode, measureCode, timestamp: time, props }) => {
            const ids = genEquipmentIds(equipmentCode);
            props.forEach(({ propValue, propCode }) => {
                const timestamp = formatTime(time);
                ids.forEach((equipId) => {
                    const id = genEquipMeasureId(
                        equipId,
                        measureCode,
                        propCode
                    );
                    callback({ id, timestamp, value: propValue });
                });
            });
        }
    );
}

function forEachMetricMsg(msg: any, callback) {
    const ids = genEquipmentIds(msg.equipmentCode);
    const timestamp = formatTime(msg.label.timestamp);
    ids.forEach((equipId) => {
        const id = genEquipmetricId(equipId, msg.metricCode);
        callback({ id, timestamp, value: msg.label.value });
    });
}

function forEachStatusMsg(msg: any, callback) {
    const ids = genEquipmentIds(msg.equipmentCode);
    const timestamp = formatTime(msg.changeTime);
    ids.forEach((equipId) => {
        const id = genEquipstatusId(equipId, msg.statusCode);
        callback({ id, timestamp, value: msg.valueDesc });
    });
}

export const equipmentUtils = {
    // forEachMeasureProp,
    forEachRealtime,
    forEachMeasureMsg,
    forEachMetricMsg,
    forEachStatusMsg,
};

export default equipmentUtils;

// 下面是一些类似于“.”（U+002E 点号）的 Unicode 字符：
// 。（U+3002 中文名称为“句号”，英文名称为“Ideographic Full Stop”）：主要在东亚地区使用，例如汉字中的句末标点符号。
// ．（U+FF0E 中文和英文名称都是“全角句号”，全角即占两个字符位置宽度，相当于英文字符的两倍宽度，通常用在中文排版中）：跟普通的.相比，它更宽一些，适合在中文字体中使用。
// ․（U+2024 中文名称为“三点号”，英文名称为“One Dot Leader”）：这个字符通常在目录或大纲中使用，作为章节标题和页码之间的分隔符。
// ・（U+30FB 中文名称为“中点”，英文名称为“Katakana Middle Dot”）：这个字符主要在日文中使用，例如作为假名（Kana）中的一个字符。
// ⋅（U+22C5 中文名称为“点运算符”，英文名称为“Dot Operator”或“Times Sign”）：这个字符通常用于表示数学中的乘法运算。
const CODE_JOINER = "\u2024";
// const NAME_JOINER = '/';

function genIdByCodes(codes: string[]) {
    return codes.join(CODE_JOINER);
}

// function genTagName(names: string[]) {
//     return names.join(NAME_JOINER);
// }

function genEquipMeasureId(equipId, measureCode, propCode) {
    return genIdByCodes([equipId, "measure", measureCode, propCode]);
}

function genEquipmetricId(equipId, metricCode) {
    return genIdByCodes([equipId, "metric", metricCode]);
}

function genEquipstatusId(equipId, statusCode) {
    return genIdByCodes([equipId, "status", statusCode]);
}

function genEquipmentId(equipmentCode) {
    const searchParams = LocationSearch.getInstance().getURLSearchParams();
    const modelCode = searchParams.get("modelCode");
    const instanceCode = searchParams.get("instanceCode");
    const extraCode = searchParams.get("extraCode");
    if ("equipmentModel" === modelCode && extraCode === equipmentCode) {
        return genIdByCodes(["equipmentModel", instanceCode]);
    }
    return genIdByCodes(["equipment", equipmentCode]);
}

function genEquipmentIds(equipmentCode) {
    const searchParams = LocationSearch.getInstance().getURLSearchParams();
    const ids = [];
    const modelCode = searchParams.get("modelCode");
    const instanceCode = searchParams.get("instanceCode");
    const extraCode = searchParams.get("extraCode");
    if ("equipmentModel" === modelCode) {
        ids.push(genIdByCodes(["equipmentModel", instanceCode]));
    } else {
        ids.push(genIdByCodes(["equipment", equipmentCode]));
    }
    if ("equipment" === modelCode) {
        ids.push(genIdByCodes(["equipmentModel", extraCode]));
    }
    return ids;
}

function formatTime(time) {
    const value = parseInt(time, 10);
    if (value.toString() === time) {
        return value;
    }
    return new Date(time).getTime();
}
