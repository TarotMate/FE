import React from 'react';


type MainHeaderProps = {
    logo: string; // 로고 이미지 경로
    onMenuClick: (path: string) => void; // 페이지 이동 처리를 위한 함수
};


const MainHeader: React.FC<MainHeaderProps> = ({ logo, onMenuClick }) => {
    return (
        <header className="bg-white text-gray-700 body-font border-b border-gray-200">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <img alt="logo" src={logo} onClick={() => onMenuClick('/')} className="w-8 h-8 -mr-1 hover:opacity-75 cursor-pointer" />
                    <span onClick={() => onMenuClick('/')} className="ml-3 text-xl text-indigo-500 cursor-pointer hover:text-gray-900">타로메이트</span>
                </div>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <div onClick={() => onMenuClick('/')} className="mr-5 hover:text-gray-900 cursor-pointer">
                        홈
                    </div>
                    <div onClick={() => onMenuClick('/tarot')} className="mr-5 hover:text-gray-900 cursor-pointer">
                        타로하기
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default MainHeader;
