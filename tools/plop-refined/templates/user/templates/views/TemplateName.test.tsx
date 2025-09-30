import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'

import TemplateName from './TemplateName';

describe('<TemplateName />', () => {
  test('it should mount', () => {
    render(<TemplateName />);

    const test = screen.getByTestId('TemplateName');

    expect(test).toBeInTheDocument();
  });
});