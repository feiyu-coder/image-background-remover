export async function onRequest(context) {
  // 只允许 POST 请求
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '仅支持 POST 请求' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await context.request.formData();
    const image = formData.get('image');

    if (!image) {
      return new Response(JSON.stringify({ error: '请上传图片' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 验证文件类型
    if (!image.type.match('image/(jpeg|png|webp)')) {
      return new Response(JSON.stringify({ error: '仅支持 JPG、PNG、WEBP 格式' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 验证文件大小
    if (image.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: '图片大小不能超过 10MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 从环境变量获取 API Key
    const apiKey = context.env.REMOVEBG_API_KEY || context.env.Value;
    
    if (!apiKey) {
      // 返回更详细的错误信息用于调试
      return new Response(JSON.stringify({ 
        error: 'API Key 未配置',
        debug: {
          hasEnv: !!context.env,
          envKeys: context.env ? Object.keys(context.env) : []
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
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
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { errors: [{ title: errorText }] };
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorData.errors?.[0]?.title || '处理失败',
          details: errorText
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 获取处理后的图片
    const resultBlob = await response.blob();
    const arrayBuffer = await resultBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUrl = `data:image/png;base64,${base64}`;

    return new Response(
      JSON.stringify({
        success: true,
        image: dataUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: '服务器错误，请稍后重试',
        message: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
