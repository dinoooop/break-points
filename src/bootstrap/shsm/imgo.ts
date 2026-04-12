import type { Crop } from "react-image-crop";

export const proportionalMeasurements = {
    default: {
        width: 50,
        height: 50,
    },
    car_image: {
        width: 422,
        height: 278,
    }
}

class imgo {

    static getProportionalWidth(
        originalWidth: number,
        originalHeight: number,
        newHeight: number
    ): number {
        const newWidth = (newHeight * originalWidth) / originalHeight;
        return Math.round(newWidth * 100) / 100; // rounded to 2 decimal places
    }

    static getProportionalHeight(
        originalWidth: number,
        originalHeight: number,
        newWidth: number
    ): number {
        const newHeight = (newWidth * originalHeight) / originalWidth;
        return Math.round(newHeight * 100) / 100;
    }

    static getMeasurement(
        type: keyof typeof proportionalMeasurements,
        w: number | null = null,
        h: number | null = null
    ): number {

        const measurements = proportionalMeasurements[type];
        if (!measurements) {
            throw new Error(`Invalid measurement type: ${type}`);
        }

        if (w == null && h != null) {
            // width not given → find proportional width
            return this.getProportionalWidth(measurements.width, measurements.height, h);
        } else if (h == null && w != null) {
            // height not given → find proportional height
            return this.getProportionalHeight(measurements.width, measurements.height, w);
        } else {
            throw new Error("Provide either width or height (not both).");
        }
    }

    
}

export const imgCrops: {
    default: Crop,
    car_image: Crop,
} = {
    default: {
        x: 25,
        y: 25,
        width: 50,
        height: imgo.getMeasurement('default', 50),
        unit: "px",
    },
    car_image: {
        x: 25,
        y: 25,
        width: 100,
        height: imgo.getMeasurement('car_image', 100),
        unit: "px",
    },
}

export const imgResizes = {
    default: [
        { name: "thumb", width: 50, height: imgo.getMeasurement('default', 50) },
        { name: "cover", width: 350, height: imgo.getMeasurement('default', 350) },
    ],
    car_image: [
        { name: "thumb", width: 414, height: imgo.getMeasurement('car_image', 414) },
        { name: "cover", width: 500, height: imgo.getMeasurement('car_image', 500) },
    ],
    avatar: [
        { name: "thumb", width: 100, height: imgo.getMeasurement('default', 100) },
        { name: "cover", width: 350, height: imgo.getMeasurement('default', 350) },
    ],
}