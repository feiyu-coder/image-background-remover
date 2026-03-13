'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // 验证文件类型
    if (!file.type.match('image/(jpeg|png|webp)')) {
      setError('请上传 JPG、PNG 或 WEBP 格式的图片');
      return;
    }

    // 验证文件大小
    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过 10MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 将 base64 转换为 File 对象
      const response = await fetch(originalImage);
      const blob = await response.blob();
      const file = new File([blob], 'image.png', { type: blob.type });

      // 调用 API
      const formData = new FormData();
      formData.append('image', file);

      const apiResponse = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(data.error || '处理失败');
      }

      setProcessedImage(data.image);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `removed-bg-${Date.now()}.png`;
    link.click();
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-12 px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">🖼️ Image Background Remover</h1>
            <p className="text-xl opacity-90">快速移除图片背景，无需注册，保护隐私</p>
          </header>

          {/* Content */}
          <div className="p-8 md:p-12">
            {!originalImage ? (
              /* Upload Area */
              <div
                className={`border-4 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-purple-600 bg-purple-50 scale-105'
                    : 'border-purple-300 bg-purple-50/50 hover:border-purple-500 hover:bg-purple-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="text-7xl mb-6">📤</div>
                <div className="text-2xl font-semibold text-purple-700 mb-3">
                  点击或拖拽上传图片
                </div>
                <div className="text-gray-500">
                  支持 JPG、PNG、WEBP 格式，最大 10MB
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
            ) : (
              /* Preview Area */
              <div className="space-y-8">
                {/* Images Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Original Image */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">原图</h3>
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={originalImage}
                        alt="原图"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Processed Image */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">处理后</h3>
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]">
                      {processedImage ? (
                        <Image
                          src={processedImage}
                          alt="处理后"
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          等待处理...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Loading */}
                {isProcessing && (
                  <div className="text-center py-8">
                    <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 text-lg">正在处理中，请稍候...</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={handleRemoveBackground}
                    disabled={isProcessing}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    移除背景
                  </button>

                  {processedImage && (
                    <button
                      onClick={handleDownload}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      下载图片
                    </button>
                  )}

                  <button
                    onClick={handleReset}
                    className="px-8 py-4 bg-gray-200 text-gray-800 text-lg font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
                  >
                    上传新图片
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-white mt-12 opacity-80">
          <p>© 2026 Image Background Remover | Made by 飞鱼</p>
        </footer>
      </div>
    </div>
  );
}
