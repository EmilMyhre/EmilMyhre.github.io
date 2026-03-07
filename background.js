let backgroundsA = el.background;

let imageIndex = 0;

function UpdateBackground(){
    backgroundsA[imageIndex].classList.remove("showing");

    imageIndex++;

    if (imageIndex >= backgroundsA.length) 
    {
        imageIndex = 0;
    }

    backgroundsA[imageIndex].classList.add("showing");
}