let videoElement = document.querySelector("video");
let recordButton = document.querySelector(".inner-record")
let capturePhoto = document.querySelector(".inner-capture");

let zoomIn = document.querySelector(".zoomIn");
let zoomOut = document.querySelector(".zoomOut");

let galleryBtn = document.querySelector(".gallery-btn");


galleryBtn.addEventListener("click",(e)=>{
    window.location.assign("gallery.html")
})


let minZoom = 1;
let maxZoom = 3;
let currentZoom = 1;

let filters = document.querySelectorAll(".filter");
let filterSelected = "none";

let mediaRecorder;
let recordingState=false;



// (function (){
//     console.log("IIFE");
// })();

zoomIn.addEventListener("click", () => {
  if (currentZoom + 0.1 > maxZoom) {
    return;
  }
  currentZoom = currentZoom + 0.1;
  videoElement.style.transform = `scale(${currentZoom})`;
});

zoomOut.addEventListener("click", () => {
  if (currentZoom - 0.1 < minZoom) {
    return;
  }
  currentZoom = currentZoom - 0.1;
  videoElement.style.transform = `scale(${currentZoom})`;
});

(async function(){

    let constraint = {video:true};
    let mediaStream = await navigator.mediaDevices.getUserMedia(constraint);

   videoElement.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.onstart = function(){
        console.log("Inside On start");
    }

    mediaRecorder.ondataavailable = function(e){
        console.log("Inside On data available");
        console.log(e.data);

        let videoObject = new Blob([e.data],{type : "video/mp4"});

        console.log(videoObject);
        addMedia(videoObject, "video");

        // let videoURL = URL.createObjectURL(videoObject);
        // let aTag = document.createElement("a");
        // aTag.download = `Video${Date.now()}.mp4`;
        // aTag.href = videoURL;
        // aTag.click();
        // console.log(videoURL);

    }
    mediaRecorder.onstop = function(){
        console.log("Inside On stop");
    }

    recordButton.addEventListener("click",function(){
        if(recordingState){
            mediaRecorder.stop();
            recordingState=false;
            recordButton.classList.remove("animate-record");
        }
        else{
             mediaRecorder.start();
             recordingState = true;
             recordButton.classList.add("animate-record");
        }
    })


    capturePhoto.addEventListener("click", function(){
        capturePhoto.classList.add("animate-capture");
        setTimeout(()=>{
            capturePhoto.classList.remove("animate-capture");
        },1000)

        let canvas = document.createElement("canvas");

        canvas.height =480;
        canvas.width = 480;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(videoElement,0,0);

        if (currentZoom!=1){
            //  ctx.translate(canvas.width / 2,canvas.height / 2);
            ctx.scale(3, 3);
            //  ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }


          if (filterSelected != "none") {
            ctx.fillStyle = filterSelected;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        

        console.log(canvas);
        //  let aTag = document.createElement("a");
        //  aTag.download = `Image${Date.now()}.jpg`;
        //  aTag.href = canvas.toDataURL("image/jpg");
        //  aTag.click();
 
        let canvasURL = canvas.toDataURL("image/jpg");
        addMedia(canvasURL,"photo");

    })
    
})();


for(let i=0;i<filters.length;i++){
    filters[i].addEventListener("click",function(e){
       // console.log(e.target);
        let currentFilterSelected = e.target.style.backgroundColor;
        console.log(currentFilterSelected)
        if(currentFilterSelected==""){
            if(document.querySelector(".filter-div")){
                document.querySelector(".filter-div").remove();
                filterSelected="none";
                return;
            }
        }

        let filterDiv = document.createElement("div");
        filterDiv.classList.add("filter-div");
        filterDiv.style.backgroundColor = currentFilterSelected;
        
        if(filterSelected=="none"){
           document.body.append(filterDiv);
        }else{
           document.querySelector(".filter-div").remove();
           document.body.append(filterDiv);
        }
        filterSelected = currentFilterSelected;
    })

}

 

  function addMedia(mediaUrl,mediaType) {
    let txnobject = db.transaction("Media", "readwrite"); // start  transaction on media table
    let mediaTable = txnobject.objectStore("Media"); // get access to media table

 mediaTable.add({ mid: Date.now(), type: mediaType, url: mediaUrl });

 txnobject.onerror = function (e) {
   console.log("transaction failed");
   console.log(e);
 };


  }