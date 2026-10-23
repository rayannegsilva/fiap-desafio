import fs from 'fs';
import path from 'path';

it.each(['calendar', 'check-file', 'chevron-down', 'close', 'logout'])(
  '%s.svg uses currentColor',
  name => {
    const svg = fs.readFileSync(
      path.join(__dirname, `${name}.svg`),
      'utf8',
    );
    expect(svg).not.toMatch(/fill="(#29F4D5|white)"/i);
    expect(svg).toMatch(/fill="currentColor"/);
    expect(svg).not.toMatch(/style="/);
  },
);
