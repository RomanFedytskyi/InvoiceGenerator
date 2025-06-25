import { StyleSheet } from '@react-pdf/renderer';

import style1 from './styles/style1';
import style2 from './styles/style2';
import style3 from './styles/style3';
import style4 from './styles/style4';
import style5 from './styles/style5';
import style6 from './styles/style6';
import style7 from './styles/style7';
import style8 from './styles/style8';
import style9 from './styles/style9';
import style10 from './styles/style10';

export const pdfStyles = {
  style1: StyleSheet.create(style1),
  style2: StyleSheet.create(style2),
  style3: StyleSheet.create(style3),
  style4: StyleSheet.create(style4),
  style5: StyleSheet.create(style5),
  style6: StyleSheet.create(style6),
  style7: StyleSheet.create(style7),
  style8: StyleSheet.create(style8),
  style9: StyleSheet.create(style9),
  style10: StyleSheet.create(style10),
} as const;

export type StyleType = keyof typeof pdfStyles;
