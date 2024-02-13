import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import 'tailwindcss/tailwind.css';

const ThumbnailMaker = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('');
    const [background, setBackground] = useState('white');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [textColor, setTextColor] = useState('#000000');
    const [fontSize, setFontSize] = useState('text-base');
    const [aspectRatio, setAspectRatio] = useState('16:9');

    const generateRandomColor = () => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setBackground(randomColor);
        setBackgroundImage(''); // Reset background image when changing color
    };

    const handleBackgroundChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setBackgroundImage(reader.result.toString());
            setBackground(''); // Reset solid background when setting image
        };
        reader.readAsDataURL(file);
    };

    const generateRandomGradient = () => {
        const gradientStart = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const gradientEnd = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const gradientBackground = `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`;
        setBackground(gradientBackground);
        setBackgroundImage(''); // Reset background image when setting gradient
    };

    const setSolidBackground = () => {
        setBackground('#FFFFFF'); // Set solid white background
        setBackgroundImage('');
    };

    const captureThumbnail = () => {
        html2canvas(document.querySelector("#thumbnail-preview")!).then(canvas => {
            const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const link = document.createElement('a');
            link.download = 'thumbnail.png';
            link.href = image;
            link.click();
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'title':
                setTitle(value);
                break;
            case 'subtitle':
                setSubtitle(value);
                break;
            case 'category':
                setCategory(value);
                break;
            case 'textColor':
                setTextColor(value);
                break;
            case 'fontSize':
                setFontSize(value);
                break;
            default:
                break;
        }
    };

    const updateAspectRatio = (ratio) => {
        setAspectRatio(ratio);
    };

    const getThumbnailDimensions = () => {
        switch (aspectRatio) {
            case '16:9':
                return 'w-[560px] h-[315px]';
            case '1:1':
                return 'w-[350px] h-[350px]';
            case '4:3':
                return 'w-[466px] h-[350px]';
            case '3:4':
                return 'w-[262px] h-[350px]';
            default:
                return 'w-[560px] h-[315px]';
        }
    };
    return (
        <div className="flex p-4">
            {/* Thumbnail Preview */}
            <div id="thumbnail-preview"
                 className={`${getThumbnailDimensions()} p-8 ${fontSize} flex flex-col justify-center items-center`}
                 style={{
                     background,
                     backgroundImage: `url(${backgroundImage})`,
                     backgroundSize: 'cover',
                     color: textColor,
                     margin: 'auto'
                 }}>
                <h1 className={`font-bold ${fontSize}`}>{title}</h1>
                <h2 className={`${fontSize}`}>{subtitle}</h2>
                <p className={`${fontSize}`}>{category}</p>
            </div>

            {/* Control Sidebar */}
            <div className="w-96 p-4">
                <div className="text-center mb-2">Size</div>
                <div className="flex justify-between mb-4">
                    <button onClick={() => updateAspectRatio('16:9')} className="btn">16:9</button>
                    <button onClick={() => updateAspectRatio('1:1')} className="btn">1:1</button>
                    <button onClick={() => updateAspectRatio('4:3')} className="btn">4:3</button>
                    <button onClick={() => updateAspectRatio('3:4')} className="btn">3:4</button>
                </div>
                <div className="text-center my-2">Background</div>
                <input type="file" accept="image/*" onChange={handleBackgroundChange}
                       className="input input-bordered w-full mb-2"/>
                <button onClick={generateRandomGradient} className="btn btn-primary w-full mb-2">Gradient Random
                </button>
                <button onClick={setSolidBackground} className="btn btn-primary w-full mb-2">Solid Color</button>
                <button onClick={generateRandomColor} className="btn btn-primary w-full mb-2">Solid Random</button>


                <input type="text" name="title" placeholder="Title" onChange={handleInputChange}
                       className="input input-bordered w-full mb-2"/>
                <input type="text" name="subtitle" placeholder="Subtitle" onChange={handleInputChange}
                       className="input input-bordered w-full mb-2"/>
                <input type="text" name="category" placeholder="Category" onChange={handleInputChange}
                       className="input input-bordered w-full mb-2"/>
                <input type="text" name="backgroundImage" placeholder="Background Image URL"
                       onChange={handleInputChange} className="input input-bordered w-full mb-2"/>
                <input type="color" name="textColor" value={textColor} onChange={handleInputChange}
                       className="input input-bordered w-16 mb-2"/>
                <select name="fontSize" value={fontSize} onChange={handleInputChange}
                        className="select select-bordered w-full mb-4">
                    <option value="text-xs">Extra Small</option>
                    <option value="text-sm">Small</option>
                    <option value="text-base">Base</option>
                    <option value="text-lg">Large</option>
                    <option value="text-xl">Extra Large</option>
                </select>
                <button onClick={generateRandomColor} className="btn btn-primary w-full mb-2">Generate Background
                </button>
                <button onClick={captureThumbnail} className="btn btn-secondary w-full mb-2">Save Thumbnail</button>


            </div>
        </div>
    );
};

export default ThumbnailMaker;
