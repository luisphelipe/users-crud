import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button component', () => {
    it('renders children when not loading', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('shows "loading..." when loading is true', () => {
        render(<Button loading>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('loading...');
    });

    it('applies small class when small is true', () => {
        render(<Button small>Small</Button>);
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('!w-[140px]');
    });

    it('disables button when loading is true', () => {
        render(<Button loading>Loading</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button when disabled prop is passed', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('adds extra class names via className prop', () => {
        render(<Button className="extra-class">Test</Button>);
        const btn = screen.getByRole('button');
        expect(btn.className).toContain('extra-class');
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Click</Button>);
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });
});
