import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ReactAgentHandlerChat',
      sourcemap: true,
      globals: {
        react: 'React',
      },
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
    }),
    terser(),
    copy({
      targets: [
        { src: 'src/types/index.d.ts', dest: 'dist/types' },
        { src: 'src/hooks/useScript.tsx', dest: 'dist/hooks' },
      ],
    }),
  ],
};
