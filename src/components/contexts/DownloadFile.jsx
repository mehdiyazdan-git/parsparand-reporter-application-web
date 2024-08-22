import React from 'react';
import {SiMicrosoftexcel} from "react-icons/si";
import useHttp from "./useHttp";
import serializeParams from "./serializeParams";



const DownloadFile = ({resourcePath,params,exportAll}) => {
    let _params = exportAll ? {...params , 'pagination' : {page: 1, size: 10000}} : params
    const url = `${resourcePath}?${serializeParams(_params)}`;
    const {download} = useHttp();
    const handleDownload = async () => {
       await download(url)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = exportAll
                    ? `get_All_${resourcePath}.xlsx`
                    : `page_${params.pagination.page}_${resourcePath}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch((error) => {
                console.error('Download error:', error);
            });
    }

    return (
        <SiMicrosoftexcel
            onClick={handleDownload}
            size="2.2rem"
            className="m-1"
            color="#41941a"
            type="button"
        >
            دانلود فایل
        </SiMicrosoftexcel>
    );
};

export default DownloadFile;