importScripts('./vendor/mediapipe/vision_bundle.js');

const {FaceDetector,FilesetResolver}=Vision;

let detectorPromise;

function createDetector(){
  if(!detectorPromise){
    detectorPromise=(async()=>{
      const wasmRoot=new URL('./vendor/mediapipe/wasm/',self.location.href).href;
      const modelUrl=new URL('./models/blaze_face_full_range.tflite',self.location.href).href;
      const vision=await FilesetResolver.forVisionTasks(wasmRoot,false);
      return FaceDetector.createFromOptions(vision,{
        baseOptions:{modelAssetPath:modelUrl,delegate:'CPU'},
        runningMode:'IMAGE',
        minDetectionConfidence:.55,
        minSuppressionThreshold:.3
      });
    })();
  }
  return detectorPromise;
}

function serialiseDetection(detection){
  const box=detection.boundingBox;
  return {
    score:detection.categories?.[0]?.score??0,
    box:box?{x:box.originX,y:box.originY,width:box.width,height:box.height}:null,
    keypoints:(detection.keypoints||[]).map(point=>({x:point.x,y:point.y,label:point.label||'',score:point.score??null}))
  };
}

self.onmessage=async event=>{
  const {type,id,bitmap}=event.data||{};
  if(type!=='detect'||!id||!bitmap)return;
  try{
    const detector=await createDetector();
    const result=detector.detect(bitmap);
    bitmap.close();
    self.postMessage({type:'result',id,faces:(result.detections||[]).map(serialiseDetection)});
  }catch(error){
    bitmap.close?.();
    self.postMessage({type:'error',id,message:error instanceof Error?error.message:String(error)});
  }
};

createDetector().then(()=>self.postMessage({type:'ready'})).catch(error=>{
  self.postMessage({type:'init-error',message:error instanceof Error?error.message:String(error)});
});
