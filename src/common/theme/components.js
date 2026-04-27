export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          backgroundImage: 'none',
          backgroundColor: '#081326',
        }),
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...(theme.palette.mode === 'dark'
          ? {
              backgroundColor: 'rgba(15, 31, 58, 0.8)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(59, 130, 246, 0.2)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(59, 130, 246, 0.45)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
              },
            }
          : {
              backgroundColor: theme.palette.background.default,
            }),
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      sizeMedium: {
        height: '40px',
      },
      containedPrimary: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
          boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            boxShadow: '0 0 28px rgba(59, 130, 246, 0.55)',
          },
        }),
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          transition: 'background-color 0.2s ease, color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            color: '#93c5fd',
          },
        }),
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          borderRadius: '10px',
          margin: '2px 8px',
          width: 'calc(100% - 16px)',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            boxShadow: 'inset 0 0 0 1px rgba(59, 130, 246, 0.2)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(59, 130, 246, 0.14)',
            boxShadow:
              'inset 0 0 0 1px rgba(59, 130, 246, 0.3), 0 0 16px rgba(59, 130, 246, 0.06)',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
            },
          },
        }),
      }),
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          background:
            'linear-gradient(135deg, rgba(37, 99, 235, 0.7) 0%, rgba(99, 102, 241, 0.7) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 0 10px rgba(37, 99, 235, 0.2)',
        }),
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: 'rgba(4, 10, 23, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(59, 130, 246, 0.15)',
          boxShadow: '-8px 0 40px rgba(0, 0, 0, 0.6)',
        }),
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: 'rgba(8, 19, 38, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow:
            '0 8px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.06), 0 0 30px rgba(37, 99, 235, 0.08)',
        }),
      }),
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: 'transparent',
          height: '60px',
        }),
      }),
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          color: '#475569',
          minWidth: 'auto',
          padding: '6px 4px',
          transition: 'color 0.2s ease',
          '&.Mui-selected': {
            color: '#3b82f6',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.68rem',
            '&.Mui-selected': {
              fontSize: '0.68rem',
            },
          },
        }),
      }),
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
      enterNextDelay: 500,
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        '@media print': {
          color: theme.palette.alwaysDark.main,
        },
        ...(theme.palette.mode === 'dark' && {
          borderColor: 'rgba(59, 130, 246, 0.08)',
        }),
      }),
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          borderColor: 'rgba(59, 130, 246, 0.12)',
        }),
      }),
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: 'rgba(8, 19, 38, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.06)',
        }),
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: 'rgba(8, 19, 38, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }),
      }),
    },
  },
};
