// export const GenerateDiffusion = () => {
//     const gradients = ["blue__gradient", "pink__gradient", "white__gradient"];
//     const percent = Math.floor((Math.random() * (200)) -100);

//     const pinkBlob = "w-[30%] h-[30%] pink__gradient";
//     const blueBlob = "w-[50%] h-[50%] blue__gradient";
//     const whiteBlob = "w-[40%] h-[40%] white__gradient";

//     const blobs = [pinkBlob, blueBlob, whiteBlob];

//     return (
//         <div className={`absolute -right-20 -bottom-20 ${blobs[Math.floor(Math.random() * blobs.length)]}`} />
//         // <div className={`absolute w-[20%] h-[20%] -right-50 -bottom-20 ${gradients[Math.floor(Math.random() * gradients.length)]}`} />
//         // <p>hellop</p>
//     )
// }

export const truncateString = (str, num) => {
    if (str == null) return "";
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...';
}