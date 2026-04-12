import os


proportional_measurements = {
    "default": {
        "width": 50,
        "height": 50,
    },
    "cover_category": {
        "width": 422,
        "height": 422,
    }
}


class Imgo:
    @staticmethod
    def get_proportional_width(original_width, original_height, new_height):
        """Calculate proportional width for given height"""
        new_width = (new_height * original_width) / original_height
        return round(new_width, 2)

    @staticmethod
    def get_proportional_height(original_width, original_height, new_width):
        """Calculate proportional height for given width"""
        new_height = (new_width * original_height) / original_width
        return round(new_height, 2)

    @staticmethod
    def get_measurement(type_name, w=None, h=None):
        """Find proportional height or width based on given type"""
        measurements = proportional_measurements.get(type_name)
        if not measurements:
            raise ValueError(f"Invalid measurement type: {type_name}")

        if w is None and h is not None:
            # width not given → find proportional width
            return Imgo.get_proportional_width(measurements["width"], measurements["height"], h)
        elif h is None and w is not None:
            # height not given → find proportional height
            return Imgo.get_proportional_height(measurements["width"], measurements["height"], w)
        else:
            raise ValueError("Provide either width or height (not both).")

    

# Equivalent to `imgCrops` in TS
img_crops = {
    "default": {
        "x": 25,
        "y": 25,
        "width": 50,
        "height": Imgo.get_measurement("default", w=50),
        "unit": "px",
    },
    "cover_category": {
        "x": 25,
        "y": 25,
        "width": 100,
        "height": Imgo.get_measurement("cover_category", w=100),
        "unit": "px",
    },
}

# Equivalent to `imgResizes` in TS
img_resizes = {
    "default": [
        {"name": "thumb", "width": 50, "height": Imgo.get_measurement("default", w=50)},
        {"name": "cover", "width": 350, "height": Imgo.get_measurement("default", w=350)},
    ],
    "cover_category": [
        {"name": "thumb", "width": 150, "height": Imgo.get_measurement("cover_category", w=150)},
        {"name": "cover", "width": 500, "height": Imgo.get_measurement("cover_category", w=500)},
    ],
    "avatar": [
        { "name": "thumb", "width": 100, "height": Imgo.get_measurement('default', 100) },
        { "name": "cover", "width": 350, "height": Imgo.get_measurement('default', 350) },
    ],
}
