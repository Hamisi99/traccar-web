const trackingBackgroundImage =
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1800&q=80';

const LoginLayout = ({ children }) => (
  <main
    style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
      backgroundImage: `linear-gradient(135deg, rgba(4, 10, 23, 0.76), rgba(8, 17, 29, 0.62)), url("${trackingBackgroundImage}")`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(140deg, rgba(8, 15, 32, 0.84) 0%, rgba(15, 23, 42, 0.72) 32%, rgba(30, 41, 59, 0.38) 58%, rgba(238, 242, 255, 0.18) 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'radial-gradient(circle, rgba(255, 255, 255, 0.09) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: -144,
        right: -144,
        width: 560,
        height: 560,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, transparent 68%)',
        filter: 'blur(64px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: -176,
        left: -176,
        width: 640,
        height: 640,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 68%)',
        filter: 'blur(72px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '30%',
        right: '25%',
        width: 340,
        height: 340,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 197, 253, 0.45) 0%, transparent 70%)',
        filter: 'blur(52px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: '22%',
        left: '22%',
        width: 220,
        height: 220,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(125, 211, 252, 0.25) 0%, transparent 70%)',
        filter: 'blur(42px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '18%',
        left: 40,
        width: 160,
        height: 160,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%)',
        filter: 'blur(36px)',
      }}
    />
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 430,
      }}
    >
      {children}
    </div>
  </main>
);

export default LoginLayout;
