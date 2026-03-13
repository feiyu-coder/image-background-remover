import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: '请上传图片' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!image.type.match('image/(jpeg|png|webp)')) {
      return NextResponse.json(
        { error: '仅支持 JPG、PNG、WEBP 格式' },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '图片大小不能超过 10MB' },
        { status: 400 }
      );
    }

    // TODO: 集成 Remove.bg API
    // 目前返回模拟数据
    const apiKey = process.env.REMOVEBG_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key 未配置，请在环境变量中设置 REMOVEBG_API_KEY' },
        { status: 500 }
      );
    }

    // 调用 Remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', image);
    removeBgFormData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.errors?.[0]?.title || '处理失败' },
        { status: response.status }
      );
    }

    // 获取处理后的图片
    const resultBlob = await response.blob();
    const arrayBuffer = await resultBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      image: dataUrl,
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
