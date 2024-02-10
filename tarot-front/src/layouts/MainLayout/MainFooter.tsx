import React from 'react';

const MainFooter: React.FC = () => {
    // 현재 연도를 구하기 위한 코드
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-gray-700 body-font">
            <div className="bg-gray-200">
                <div className="container mx-auto pt-4 px-5 flex flex-wrap flex-col sm:flex-row">
                    <p className="text-gray-500 text-sm text-center sm:text-left">
                        © {currentYear} 타로메이트
                    </p>
                    <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">
            타로메이트
          </span>
                </div>
                <div className="container mx-auto pb-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">
            Developed by tarotmate Team
          </span>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;
