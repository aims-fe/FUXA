// 下面是一些类似于“.”（U+002E 点号）的 Unicode 字符：
// 。（U+3002 中文名称为“句号”，英文名称为“Ideographic Full Stop”）：主要在东亚地区使用，例如汉字中的句末标点符号。
// ．（U+FF0E 中文和英文名称都是“全角句号”，全角即占两个字符位置宽度，相当于英文字符的两倍宽度，通常用在中文排版中）：跟普通的.相比，它更宽一些，适合在中文字体中使用。
// ․（U+2024 中文名称为“三点号”，英文名称为“One Dot Leader”）：这个字符通常在目录或大纲中使用，作为章节标题和页码之间的分隔符。
// ・（U+30FB 中文名称为“中点”，英文名称为“Katakana Middle Dot”）：这个字符主要在日文中使用，例如作为假名（Kana）中的一个字符。
// ⋅（U+22C5 中文名称为“点运算符”，英文名称为“Dot Operator”或“Times Sign”）：这个字符通常用于表示数学中的乘法运算。
const CODE_JOINER = '\u2024';
const NAME_JOINER = '/';

function genIdByCodes(codes: string[]) {
    return codes.join(CODE_JOINER);
}

function genTagName(names: string[]) {
    return names.join(NAME_JOINER);
}

interface EquipmentRealtime {
    equipmentCode: string;
    equipmentName: string;
    measureValues: EquipmentMeasureValue[];
    metrics: any[];
    status: any[];
}

interface EquipmentMeasureValue {
    measureCode: string;
    measureName: string;
    displayGroup: string;
    displaySort: number;
    timestamp?: string;
    props: EquipmentMeasurePropValue[];
}

interface EquipmentMeasurePropValue {
    propCode?: string;
    propCnName?: string;
    propComment?: string;
    propValue?: string | number;
    valueType?: string;
    valueLen?: string;
    valueFormat?: string;
    defaultValue?: string;
    signalType?: string;
    lowerLimit1?: string;
    upperLimit1?: string;
    lowerLimit2?: string;
    upperLimit2?: string;
}

interface EquipmentTagOptions {
    id: string;
    equipmentCode: string;
    equipmentName: string;
    measureCode?: string;
    measureName?: string;
    propCode?: string;
    propName?: string;
    metricCode?: string;
    metricName?: string;
    unit: string;
    value?: string | number;
    timestamp: string;
    valueFormat?: string;
    valueLen?: string;
    valueType?: string;
}

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

function forEachMeasureProp(
    realtime: EquipmentRealtime,
    callback: (options: EquipmentTagOptions) => void
) {
    (realtime?.measureValues || []).forEach(
        ({ measureCode, measureName, props, timestamp }) => {
            props.forEach(
                ({
                    propCode,
                    propCnName,
                    propComment,
                    valueFormat,
                    valueLen,
                    valueType,
                    propValue,
                }) => {
                    callback({
                        id: genIdByCodes([
                            'equipment',
                            realtime.equipmentCode,
                            measureCode,
                            propCode,
                        ]),
                        equipmentCode: realtime.equipmentCode,
                        equipmentName: realtime.equipmentName,
                        measureCode,
                        measureName,
                        propCode,
                        propName: propCnName,
                        unit: propComment,
                        value: propValue,
                        timestamp,
                        valueFormat,
                        valueLen,
                        valueType,
                    });
                }
            );
        }
    );
}

function genMeasurePropTag(options: EquipmentTagOptions) {
    return {
        id: options.id,
        name: genTagName([options.measureName, options.propName]),
        address: genIdByCodes([options.measureCode, options.propCode]),
        memaddress: options.propCode,
        type: options.unit,
        options: options,
    };
}

function forEachMetric(
    realtime: EquipmentRealtime,
    callback: (options: EquipmentTagOptions) => void
) {
    (realtime?.metrics || []).forEach(
        ({ metricCode, metricName, label, unit }) => {
            callback({
                id: genIdByCodes([
                    'equipment',
                    realtime.equipmentCode,
                    metricCode,
                ]),
                equipmentCode: realtime.equipmentCode,
                equipmentName: realtime.equipmentCode,
                metricCode,
                metricName,
                unit: unit,
                value: label?.value,
                timestamp: label?.timestamp,
            });
        }
    );
}

function genMetricTag(options: EquipmentTagOptions) {
    return {
        id: options.id,
        name: options.metricName,
        address: options.metricCode,
        // memaddress: '',
        type: options.unit,
        options: options,
    };
}

function forEachMeasureMsg(msg: MeasureMsg[], callback) {
    (msg || []).forEach(({ equipmentCode, measureCode, timestamp, props }) => {
        props.forEach(({ propValue, propCode }) => {
            callback({
                id: genIdByCodes([
                    'equipment',
                    equipmentCode,
                    measureCode,
                    propCode,
                ]),
                timestamp,
                value: propValue,
            });
        });
    });
}

export const equipmentUtils = {
    forEachMeasureProp,
    genMeasurePropTag,
    forEachMetric,
    genMetricTag,
    forEachMeasureMsg,
};

export default equipmentUtils;
