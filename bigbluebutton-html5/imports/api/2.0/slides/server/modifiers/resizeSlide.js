import { check } from 'meteor/check';
import Slides from '/imports/api/2.0/slides';
import Logger from '/imports/startup/server/logger';
import calculateSlideData from '/imports/api/2.0/slides/server/helpers';

export default function resizeSlide(meetingId, slide) {
  check(meetingId, String);

  const { presentationId } = slide;
  const { pageId, widthRatio, heightRatio, xOffset, yOffset } = slide;

  const selector = {
    meetingId,
    presentationId,
    id: pageId,
  };

  const modifier = {
    $set: {
      widthRatio,
      heightRatio,
      xOffset,
      yOffset,
    },
  };

  // fetching the current slide data
  // and pre-calculating the width, height, and vieBox coordinates / sizes
  // to reduce the client-side load
  const _slide = Slides.findOne(selector);
  const slideData = {
    width: _slide.calculatedData.width,
    height: _slide.calculatedData.height,
    xOffset,
    yOffset,
    widthRatio,
    heightRatio,
  };
  const calculatedData = calculateSlideData(slideData);
  calculatedData.imageUri = _slide.calculatedData.imageUri;
  calculatedData.width = _slide.calculatedData.width;
  calculatedData.height = _slide.calculatedData.height;
  modifier.$set.calculatedData = calculatedData;

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Resizing slide id=${pageId}: ${err}`);
    }

    if (numChanged) {
      return Logger.info(`Resized slide id=${pageId}`);
    }

    return Logger.info(`No slide found with id=${pageId}`);
  };

  return Slides.update(selector, modifier, cb);
}
