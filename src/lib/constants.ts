export const THEMES_URL =
  'https://raw.githubusercontent.com/ohmyzsh/wiki/refs/heads/main/Themes.md';
export const OVERVIEW_URL =
  'https://raw.githubusercontent.com/ohmyzsh/wiki/refs/heads/main/Themes-Overview.md';

export const FEAT_COLOR: Record<string, string> = {
  git:              '#f0883e',
  hg:               '#79c0ff',
  ruby:             '#ff6b8a',
  virtualenv:       '#3fb950',
  conda:            '#3fb950',
  root_indicator:   '#ffa657',
  ssh_indicator:    '#d2a8ff',
  'vi-mode':        '#ff79c6',
  battery:          '#e3b341',
  nodejs:           '#56d364',
  kube:             '#58a6ff',
  aws:              '#ff9f43',
  terraform:        '#bc8cff',
  bzr:              '#c9d1d9',
  vcs_info:         '#8b949e',
  command_duration: '#ffd700',
  history_number:   '#bfdbfe',
  rvm:              '#fb7185',
  jenv:             '#a3e635',
};

export const FEAT_LABEL: Record<string, string> = {
  git:              'git',
  hg:               'mercurial',
  ruby:             'ruby',
  virtualenv:       'virtualenv',
  conda:            'conda',
  root_indicator:   'root',
  ssh_indicator:    'SSH',
  'vi-mode':        'vi mode',
  battery:          'battery',
  nodejs:           'node.js',
  kube:             'kubernetes',
  aws:              'AWS',
  terraform:        'terraform',
  bzr:              'bazaar',
  vcs_info:         'VCS info',
  command_duration: 'duration',
  history_number:   'history #',
  rvm:              'RVM',
  jenv:             'jenv',
  customizable:     'customizable',
  fortune_commandlinefu: 'fortune',
};

export const PIP_PRIORITY = [
  'git', 'ruby', 'virtualenv', 'hg', 'ssh_indicator',
  'root_indicator', 'vi-mode', 'battery', 'nodejs', 'kube',
];
