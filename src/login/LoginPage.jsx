import { useEffect, useState } from 'react';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import {
  generateLoginToken,
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from '../common/components/NativeInterface';
import { useCatch } from '../reactHelper';
import QrCodeDialog from '../common/components/QrCodeDialog';
import fetchOrThrow from '../common/util/fetchOrThrow';

const loginBrandName = 'Simpo Tracker';

const styles = {
  options: {
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 2,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  optionButton: {
    width: 42,
    height: 42,
    border: '1px solid rgba(148, 163, 184, 0.24)',
    borderRadius: 14,
    background: 'rgba(15, 23, 42, 0.5)',
    color: '#dbeafe',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  optionSelect: {
    minWidth: 150,
    height: 42,
    borderRadius: 14,
    border: '1px solid rgba(148, 163, 184, 0.22)',
    background: 'rgba(15, 23, 42, 0.5)',
    color: '#e2e8f0',
    padding: '0 14px',
    outline: 'none',
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  cardTop: {
    height: 5,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    background: 'linear-gradient(90deg, #38bdf8, #60a5fa, #2563eb, #0f172a, #38bdf8)',
  },
  cardBody: {
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    background: 'linear-gradient(180deg, rgba(9, 16, 31, 0.84), rgba(15, 23, 42, 0.9))',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderTop: 'none',
    boxShadow: '0 28px 80px rgba(2, 6, 23, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
  },
  bodyInner: {
    padding: 32,
  },
  brandBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandShell: {
    width: '100%',
    maxWidth: 280,
    display: 'flex',
    justifyContent: 'center',
    padding: '12px 16px',
    marginBottom: 16,
    borderRadius: 18,
    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.14), rgba(37, 99, 235, 0.1))',
    border: '1.5px solid rgba(96, 165, 250, 0.22)',
    boxShadow: '0 14px 34px rgba(2, 6, 23, 0.24)',
  },
  brandLogo: {
    width: '100%',
    maxWidth: 220,
    height: 'auto',
    display: 'block',
  },
  brandTitle: {
    color: '#dbeafe',
    fontWeight: 700,
    fontSize: 16,
    textAlign: 'center',
  },
  brandSubtitle: {
    marginTop: 6,
    color: '#94a3b8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    textAlign: 'center',
  },
  intro: {
    marginBottom: 8,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  fieldBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: '#cbd5e1',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 18,
    background: 'rgba(15, 23, 42, 0.55)',
    border: '1px solid rgba(148, 163, 184, 0.24)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
  },
  inputIcon: {
    paddingLeft: 14,
    paddingRight: 10,
    color: '#94a3b8',
    display: 'inline-flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#f8fafc',
    padding: '15px 0',
    fontSize: 15,
  },
  eyeButton: {
    border: 'none',
    background: 'transparent',
    color: '#cbd5e1',
    padding: '0 14px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorAlert: {
    padding: '12px 16px',
    borderRadius: 14,
    border: '1px solid rgba(248, 113, 113, 0.25)',
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#fecaca',
    fontSize: 14,
  },
  primaryButton: {
    width: '100%',
    border: 'none',
    borderRadius: 18,
    padding: '14px 16px',
    fontSize: 15,
    fontWeight: 700,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
    boxShadow: '0 18px 40px rgba(37, 99, 235, 0.28)',
    cursor: 'pointer',
  },
  primaryButtonDisabled: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.75), rgba(37, 99, 235, 0.72))',
    opacity: 0.72,
    cursor: 'not-allowed',
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 18,
    border: '1px solid rgba(96, 165, 250, 0.38)',
    padding: '14px 16px',
    fontSize: 15,
    fontWeight: 700,
    color: '#dbeafe',
    background: 'rgba(15, 23, 42, 0.46)',
    cursor: 'pointer',
  },
  dividerText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 12,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  auxiliaryLinks: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  linkButton: {
    border: 'none',
    background: 'transparent',
    color: '#7dd3fc',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    padding: 0,
  },
  footer: {
    padding: '18px 32px',
    textAlign: 'center',
    borderTop: '1px solid rgba(148, 163, 184, 0.16)',
    background: 'rgba(2, 6, 23, 0.18)',
  },
  footerText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 1.6,
  },
  footerLink: {
    color: '#7dd3fc',
    fontWeight: 600,
    textDecoration: 'none',
  },
  copyright: {
    marginTop: 20,
    textAlign: 'center',
    color: 'rgba(226, 232, 240, 0.85)',
    fontSize: 11,
  },
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const { languages, language, setLocalLanguage } = useLocalization();
  const languageList = Object.entries(languages).map(([code, value]) => ({
    code,
    country: value.country,
    name: value.name,
  }));

  const [failed, setFailed] = useState(false);
  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => {
    const attributes = state.session.server.attributes;
    return !attributes.language && !attributes['ui.disableLoginLanguage'];
  });
  const changeEnabled = useSelector((state) => !state.session.server.attributes.disableChange);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);
  const openIdEnabled = useSelector((state) => state.session.server.openIdEnabled);
  const openIdForced = useSelector(
    (state) => state.session.server.openIdEnabled && state.session.server.openIdForce,
  );
  const announcement = useSelector((state) => state.session.server.announcement);
  const supportLink = useSelector((state) => state.session.server.attributes?.support);

  const [codeEnabled, setCodeEnabled] = useState(false);
  const [announcementShown, setAnnouncementShown] = useState(false);

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);
    try {
      const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(code.length ? `${query}&code=${code}` : query),
      });
      if (response.ok) {
        const user = await response.json();
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        const target = window.sessionStorage.getItem('postLogin') || '/';
        window.sessionStorage.removeItem('postLogin');
        navigate(target, { replace: true });
      } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'TOTP') {
        setCodeEnabled(true);
      } else {
        throw Error(await response.text());
      }
    } catch {
      setFailed(true);
      setPassword('');
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetchOrThrow(`/api/session?token=${encodeURIComponent(token)}`);
    const user = await response.json();
    dispatch(sessionActions.updateUser(user));
    navigate('/');
  });

  const handleOpenIdLogin = () => {
    document.location = '/api/session/openid/auth';
  };

  useEffect(() => nativePostMessage('authentication'), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  return (
    <LoginLayout>
      <div style={styles.options}>
        {nativeEnvironment && changeEnabled && (
          <button
            type="button"
            title={`${t('settingsServer')}: ${window.location.hostname}`}
            style={styles.optionButton}
            onClick={() => navigate('/change-server')}
          >
            <VpnLockIcon fontSize="small" />
          </button>
        )}
        {!nativeEnvironment && (
          <button
            type="button"
            title={t('loginLogin')}
            style={styles.optionButton}
            onClick={() => setShowQr(true)}
          >
            <QrCode2Icon fontSize="small" />
          </button>
        )}
        {languageEnabled && (
          <select
            value={language}
            onChange={(event) => setLocalLanguage(event.target.value)}
            style={styles.optionSelect}
          >
            {languageList.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={styles.container}>
        <div style={styles.cardTop} />
        <div style={styles.cardBody}>
          <div style={styles.bodyInner}>
            <div style={styles.brandBlock}>
              <div style={styles.brandShell}>
                <img
                  src="/simpo-tracker-logo.svg"
                  alt={loginBrandName}
                  style={styles.brandLogo}
                />
              </div>
              <div style={styles.brandTitle}>{loginBrandName}</div>
              <div style={styles.brandSubtitle}>GPS Tracking Platform</div>
            </div>

            <div style={styles.intro} />

            <form style={styles.form} onSubmit={handlePasswordLogin}>
              {!openIdForced && (
                <>
                  <div style={styles.fieldBlock}>
                    <label htmlFor="login-email" style={styles.label}>
                      {t('userEmail')}
                    </label>
                    <div style={styles.inputWrap}>
                      <span style={styles.inputIcon}>
                        <AlternateEmailIcon fontSize="small" />
                      </span>
                      <input
                        id="login-email"
                        required
                        name="email"
                        autoComplete="email"
                        autoFocus={!email}
                        value={email}
                        placeholder="you@example.com"
                        style={styles.input}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                  </div>

                  <div style={styles.fieldBlock}>
                    <label htmlFor="login-password" style={styles.label}>
                      {t('userPassword')}
                    </label>
                    <div style={styles.inputWrap}>
                      <span style={styles.inputIcon}>
                        <LockOutlinedIcon fontSize="small" />
                      </span>
                      <input
                        id="login-password"
                        required
                        name="password"
                        autoComplete="current-password"
                        autoFocus={!!email}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        placeholder="Enter your password"
                        style={styles.input}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        style={styles.eyeButton}
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </button>
                    </div>
                  </div>

                  {codeEnabled && (
                    <div style={styles.fieldBlock}>
                      <label htmlFor="login-code" style={styles.label}>
                        {t('loginTotpCode')}
                      </label>
                      <div style={styles.inputWrap}>
                        <input
                          id="login-code"
                          required
                          name="code"
                          type="number"
                          value={code}
                          placeholder="000000"
                          style={{ ...styles.input, paddingLeft: 14 }}
                          onChange={(event) => setCode(event.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {failed && <div style={styles.errorAlert}>Invalid username or password</div>}

                  <button
                    type="submit"
                    disabled={!email || !password || (codeEnabled && !code)}
                    style={{
                      ...styles.primaryButton,
                      ...((!email || !password || (codeEnabled && !code))
                        ? styles.primaryButtonDisabled
                        : null),
                    }}
                  >
                    {t('loginLogin')}
                  </button>
                </>
              )}

              {openIdEnabled && (
                <>
                  {!openIdForced && <div style={styles.dividerText}>or continue with</div>}
                  <button type="button" style={styles.secondaryButton} onClick={handleOpenIdLogin}>
                    {t('loginOpenId')}
                  </button>
                </>
              )}

              {!openIdForced && (
                <div style={styles.auxiliaryLinks}>
                  {registrationEnabled ? (
                    <button
                      type="button"
                      style={styles.linkButton}
                      onClick={() => navigate('/register')}
                    >
                      {t('loginRegister')}
                    </button>
                  ) : (
                    <span />
                  )}
                  {emailEnabled && (
                    <button
                      type="button"
                      style={styles.linkButton}
                      onClick={() => navigate('/reset-password')}
                    >
                      {t('loginReset')}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          <div style={styles.footer}>
            <div style={styles.footerText}>
              {supportLink ? (
                <>
                  Need help accessing your account?{' '}
                  <a href={supportLink} style={styles.footerLink}>
                    Contact support
                  </a>
                </>
              ) : (
                'Need help accessing your account? Contact your administrator.'
              )}
            </div>
          </div>
        </div>

        <div style={styles.copyright}>
          {`Copyright ${new Date().getFullYear()} ${loginBrandName}. All rights reserved.`}
        </div>
      </div>

      <QrCodeDialog open={showQr} onClose={() => setShowQr(false)} />
      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={
          <IconButton size="small" color="inherit" onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </LoginLayout>
  );
};

export default LoginPage;
