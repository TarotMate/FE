import {ChangeEvent, useRef, useState} from 'react';
import html2canvas from 'html2canvas';
import 'tailwindcss/tailwind.css';

const ThumbnailMaker = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('');
    const [background, setBackground] = useState('white');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [textColor] = useState('#000000');
    const [aspectRatio, setAspectRatio] = useState('16:9');

    // 커스텀 배경색
    const [customBackgroundColor, setCustomBackgroundColor] = useState('#FFFFFF');
    // 숨겨진 색상 선택기를 위한 ref
    const colorInputRef = useRef(null);

    // 사용자가 색상을 선택하면 배경색을 변경하는 함수
    const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newColor = event.target.value;
        setCustomBackgroundColor(newColor);
        setBackground(newColor);
        setBackgroundImage('');
    };

    const [borderSize, setBorderSize] = useState('0px'); // 테두리 크기 상태
    const [borderColor, setBorderColor] = useState('#000000'); // 테두리 색상 상태

    // 테두리 색상 선택기를 위한 ref
    const borderColorInputRef = useRef(null);

    // 테두리 색상 변경 핸들러
    const handleBorderColorChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBorderColor(event.target.value);
    };


    // 테두리 크기 변경 핸들러

    const handleBorderSizeChange = (size: string) => { // Consider defining a more specific type if the size is limited to certain values
        setBorderSize(size);
    };


    // 제목, 소제목, 카테고리에 대한 색상 및 크기 상태
    const [titleColor, setTitleColor] = useState('#000000');
    const [titleSize, setTitleSize] = useState('text-base');
    const [subtitleColor, setSubtitleColor] = useState('#000000');
    const [subtitleSize, setSubtitleSize] = useState('text-base');
    const [categoryColor, setCategoryColor] = useState('#000000');
    const [categorySize, setCategorySize] = useState('text-base');
    const generateRandomColor = () => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setBackground(randomColor);
        setBackgroundImage(''); // Reset background image when changing color
    };
    import React, { ChangeEvent } from 'react'; // Ensure ChangeEvent is imported


    const generateRandomGradient = () => {
        const gradientStart = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const gradientEnd = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const gradientBackground = `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`;
        setBackground(gradientBackground);
        setBackgroundImage(''); // Reset background image when setting gradient
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

    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
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
            case 'titleColor':
                setTitleColor(value);
                break;
            case 'titleSize':
                setTitleSize(value);
                break;
            case 'subtitleColor':
                setSubtitleColor(value);
                break;
            case 'subtitleSize':
                setSubtitleSize(value);
                break;
            case 'categoryColor':
                setCategoryColor(value);
                break;
            case 'categorySize':
                setCategorySize(value);
                break;
            default:
                break;
        }
    };

    const updateAspectRatio = (ratio: string) => { // Consider defining a more specific type if the ratio is limited to certain values
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

    // 썸네일을 클립보드에 복사하는 함수
    const copyToClipboard = () => {
        html2canvas(document.querySelector("#thumbnail-preview") as HTMLElement).then(canvas => {
            canvas.toBlob(blob => {
                if (blob) {
                    const item = new ClipboardItem({ "image/png": blob });
                    navigator.clipboard.write([item]);
                }
            });
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800"> {/* Layout div for dark background */}

            <div className="flex flex-grow"> {/* Adjusted for flexible layout */}
                {/* Thumbnail Preview */}
                <div id="thumbnail-preview"
                     className={`${getThumbnailDimensions()} p-8 flex flex-col justify-center items-center`}
                     style={{
                         background,
                         backgroundImage: `url(${backgroundImage})`,
                         backgroundSize: 'cover', // 이미지가 영역을 꽉 채우도록 설정
                         backgroundRepeat: 'no-repeat',
                         backgroundPosition: 'center',
                         color: textColor,
                         border: `${borderSize} solid ${borderColor}`,
                         margin: 'auto'
                     }}>
                    <h1 className={`font-bold ${titleSize}`} style={{ color: titleColor }}>{title}</h1>
                    <h2 className={`${subtitleSize}`} style={{ color: subtitleColor }}>{subtitle}</h2>
                    <p className={`${categorySize}`} style={{ color: categoryColor }}>{category}</p>
                </div>



                {/* Control Sidebar */}
                <div className="w-full md:w-96 h-screen bg-gray-200 p-4 flex flex-col"> {/* Sidebar settings adjusted for full height */}
                    <div className="flex items-center space-x-2 my-2">
                <div className="text-left mb-2">썸네일 크기</div>
                <div className="flex justify-between mb-4">
                    <button onClick={() => updateAspectRatio('16:9')} className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">16:9</button>
                    <button onClick={() => updateAspectRatio('1:1')} className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">1:1</button>
                    <button onClick={() => updateAspectRatio('4:3')} className="btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">4:3</button>
                    <button onClick={() => updateAspectRatio('3:4')} className="btn bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">3:4</button>
                </div>
                    </div>
                    <div className="flex items-center space-x-2 my-2">
                        <div className="text-black">배경색</div>
                        <input
                            type="color"
                            ref={colorInputRef}
                            value={customBackgroundColor} // value 속성에 상태 바인딩
                            onChange={handleColorChange}
                        />

                        <button onClick={generateRandomGradient} className="btn mb-2 bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition duration-150 ease-in-out">
                            그라데이션
                        </button>
                        <button onClick={generateRandomColor} className="btn mb-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 transition duration-150 ease-in-out">
                            단색 랜덤
                        </button>
                    </div>
                    <div className="flex items-center space-x-2 my-2">
                        <p>테두리색</p>
                        {/* 테두리 색상 선택 */}
                        <input
                            type="color"
                            ref={borderColorInputRef}
                            value={borderColor}
                            onChange={handleBorderColorChange}
                        />
                        <select
                            id="borderSize"
                            className="select select-bordered select-sm max-w-xs"
                            onChange={(e) => handleBorderSizeChange(e.target.value)}
                        >
                            <option value="0px">None</option>
                            <option value="5px">5px</option>
                            <option value="15px">15px</option>
                            <option value="30px">30px</option>
                        </select>
                        {/* "None" 버튼 스타일링 */}
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out" onClick={() => handleBorderSizeChange('0px')}>
                            테두리 없애기
                        </button>
                    </div>


                    {/* Title 설정 */}
                    <div className="flex items-center space-x-2 my-2">
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            onChange={handleInputChange}
                            className="input input-bordered flex-1"
                        />
                        <input
                            type="color"
                            name="titleColor"
                            value={titleColor}
                            onChange={handleInputChange}
                            className="input input-bordered w-16"
                        />
                        <select
                            name="titleSize"
                            value={titleSize}
                            onChange={handleInputChange}
                            className="select select-bordered"
                        >
                            <option value="text-xs">XS</option>
                            <option value="text-sm">SM</option>
                            <option value="text-base">Base</option>
                            <option value="text-lg">LG</option>
                            <option value="text-xl">XL</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2 my-2">
                        <input
                            type="text"
                            name="subtitle"
                            placeholder="Subtitle"
                            onChange={handleInputChange}
                            className="input input-bordered flex-1"
                        />
                        <input
                            type="color"
                            name="subtitleColor"
                            value={subtitleColor}
                            onChange={handleInputChange}
                            className="input input-bordered w-16"
                        />
                        <select
                            name="subtitleSize"
                            value={subtitleSize}
                            onChange={handleInputChange}
                            className="select select-bordered"
                        >
                            <option value="text-xs">XS</option>
                            <option value="text-sm">SM</option>
                            <option value="text-base">Base</option>
                            <option value="text-lg">LG</option>
                            <option value="text-xl">XL</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2 my-2">
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            onChange={handleInputChange}
                            className="input input-bordered flex-1"
                        />
                        <input
                            type="color"
                            name="categoryColor"
                            value={categoryColor}
                            onChange={handleInputChange}
                            className="input input-bordered w-16"
                        />
                        <select
                            name="categorySize"
                            value={categorySize}
                            onChange={handleInputChange}
                            className="select select-bordered"
                        >
                            <option value="text-xs">XS</option>
                            <option value="text-sm">SM</option>
                            <option value="text-base">Base</option>
                            <option value="text-lg">LG</option>
                            <option value="text-xl">XL</option>
                        </select>
                    </div>
                    {/* 클립보드 복사 버튼 */}
                    <button onClick={copyToClipboard} className="btn w-full mb-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                        클립보드 복사
                    </button>
                    <button onClick={captureThumbnail} className="btn bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out mb-2">썸네일 파일 저장</button>
            </div>
            </div>
        </div>
    );
};

export default ThumbnailMaker;
