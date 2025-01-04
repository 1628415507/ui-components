/*
 * @Description:
 * @Date: 2023-11-14 13:40:34
 * @LastEditTime: 2023-11-15 16:52:05
 */
export const getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
export const getRotationAngle = (point1, point2) => {
    if (!(point1 && point2)) {
        return 0;
    }
    let dRotateAngle = Math.atan2(Math.abs(point1[0] - point2[0]), Math.abs(point1[1] - point2[1]));
    if (point2[0] >= point1[0]) {
        if (point2[1] >= point1[1]) {
        } else {
            dRotateAngle = Math.PI - dRotateAngle;
        }
    } else {
        if (point2[1] >= point1[1]) {
            dRotateAngle = 2 * Math.PI - dRotateAngle;
        } else {
            dRotateAngle = Math.PI + dRotateAngle;
        }
    }
    dRotateAngle = (dRotateAngle * 180) / Math.PI;
    return dRotateAngle;
};
