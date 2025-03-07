export interface PDD920LogoOptions {
    text: string;
    t: string;
    type?: 'json';
}

interface PDD920Response {
    url: string;
}

export class PDD920LogoGenerator {
    private static readonly BASE_URL = 'https://api.920pdd.com/API/ceshi/wx/';

    /**
     * 生成图片
     * @param options 配置选项
     * @returns 如果type为json，返回JSON响应；否则返回图片buffer
     */
    public static async generate(options: PDD920LogoOptions): Promise<PDD920Response | Buffer> {
        try {
            // 构建URL和参数
            const params = new URLSearchParams();
            params.append('text', options.text);
            params.append('t', options.t);
            if (options.type) {
                params.append('type', options.type);
            }
            const url = `${this.BASE_URL}?${params.toString()}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`图片生成失败: HTTP ${response.status}`);
            }

            if (options.type === 'json') {
                const data = await response.json() as PDD920Response;
                return data;
            } else {
                const buffer = await response.arrayBuffer();
                return Buffer.from(buffer);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`图片生成失败: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * 将图片保存到文件
     * @param options 配置选项
     * @param outputPath 输出文件路径
     */
    public static async saveToFile(
        options: PDD920LogoOptions,
        outputPath: string
    ): Promise<void> {
        const result = await this.generate({ ...options, type: undefined });
        if (Buffer.isBuffer(result)) {
            const fs = require('fs').promises;
            await fs.writeFile(outputPath, result);
        } else {
            throw new Error('无法保存图片：生成结果不是Buffer类型');
        }
    }
} 