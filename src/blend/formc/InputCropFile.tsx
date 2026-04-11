import React, { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import type { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImage } from "../../helpers/cssm/getCroppedImage";
import { outer } from "../../helpers/cssm/outer";
import { imgCrops } from "../../bootstrap/shsm/imgo";

interface InputCropFileProps {
  name: string;
  fieldSet: Record<string, any>;
  formValues: Record<string, any>;
  onChangeForm: (name: string, value: any) => void;
  updateExtraFields: (value: any) => void;
  errors: Record<string, string>;
  imgCropKey?: string | null;
}

const InputCropFile: React.FC<InputCropFileProps> = ({
  name,
  fieldSet,
  formValues,
  onChangeForm,
  updateExtraFields,
  errors,
  imgCropKey,
}) => {

  if (!fieldSet[name]) {
    throw new Error(`${name} not found`);
  }

  const newId = fieldSet[name].id;
  const newLabel = fieldSet[name].label;

  const cropSize = imgCrops[imgCropKey as keyof typeof imgCrops] ?? imgCrops['default'];

  const aspect = cropSize.width / cropSize.height;

  const [crop, setCrop] = useState<Crop>(cropSize);
  const [changedUrl, setChangedUrl] = useState<string>("#");
  const [previousValue, setPreviousValue] = useState<string>("#");
  const [showModal, setShowModal] = useState(false);
  const [croppedUrl, setCroppedUrl] = useState<string>("");
  const error = errors[name] ?? "";

  useEffect(() => {
    const value = formValues[name];
    if (!(value instanceof File)) setPreviousValue(value);
  }, [formValues]);


  const handleOnComplete = async (_: Crop, percentCrop: Crop) => {

    // onChangeForm(`${name}_x`, percentCrop.x)
    // onChangeForm(`${name}_y`, percentCrop.y)
    // onChangeForm(`${name}_w`, percentCrop.width)
    // onChangeForm(`${name}_h`, percentCrop.height)
    
    const theCrop = {
      x: percentCrop.x,
      y: percentCrop.y,
      w: percentCrop.width,
      h: percentCrop.height,
    }
    updateExtraFields({ [`${name}_crop`]: JSON.stringify(theCrop) })

    if (changedUrl !== "#" && percentCrop.width && percentCrop.height) {
      const cropped = await getCroppedImage(changedUrl, percentCrop);
      setCroppedUrl(cropped);
    }
  };

  const onChangeInputField = (e: React.ChangeEvent<HTMLInputElement>) => {

    setShowModal(true);

    const newValue = e.target.files

    if (newValue instanceof FileList) {

      const file = newValue[0]

      if (file && file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file)
        setChangedUrl(fileUrl)
        onChangeForm(name, file)
      } else {
        console.warn(`Unsupported file type for ${name}:`, file?.type)
        setChangedUrl("#")
        onChangeForm(name, null)
      }

    } else {
      setChangedUrl("#")
      onChangeForm(name, null)
    }



  };

  return (
    <div className="form-group">
      <label htmlFor={newId}>{newLabel}</label>
      <input
        type="file"
        id={newId}
        name={name}
        accept="image/*"
        onChange={onChangeInputField}
        className="file-input-hidden"
      />
      {
        croppedUrl ?
          <div className="image-preview">
            <label htmlFor={newId}>
              <img src={croppedUrl} alt={`${newLabel} cropped preview`} />
            </label>
          </div>
          :
          <>
            {
              previousValue == "#" ?
                <div className="holder">
                  <label htmlFor={newId}>Click here to upload an image</label>
                </div>
                :
                <div className="image-preview">
                  <label htmlFor={newId}>
                    <img src={outer.showImage(previousValue, 'thumb')} />
                  </label>
                </div>
            }
          </>
      }

      {error && <div className="color-red">{error}</div>}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing on content click
          >
            <h3>Crop Image</h3>
            {changedUrl !== "#" && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={aspect}
                onComplete={handleOnComplete}
              >
                <img src={changedUrl} alt={`${newLabel} preview`} />
              </ReactCrop>
            )}
            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputCropFile;
