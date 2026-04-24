
export default function DetailProductPage({detailProduct}) {
    return (
        <div 
        style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url("/noise-bg.webp")`
        }}
        className="min-h-screen">

           <div className="container mx-10">
                <h3 
                style={{ fontFamily: "BeVietNamPro, sans-serif" }}
                className="text-2xl text-black p-8">Chi Tiết Sản Phẩm </h3>
                <p className="text-lg text-gray-700 p-8">{ "Không có mô tả nào." }</p>
           </div>
        </div>
    );
}