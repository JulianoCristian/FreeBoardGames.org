import { GAMES_LIST } from './games';

export interface IPageMetadata {
  title: string; description: string;
  url?: RegExp;
}

const TITLE_PREFIX = 'FreeBoardGame.org - ';

const DEFAULT_METADATA: IPageMetadata = {
  title: TITLE_PREFIX + 'Play Free Board Games Online',
  description: 'Play board games in your browser for free. \
Compete against your online friends or play locally. Free and open-source software project.',
};

// Most specific URLs MUST come first.
const PAGES_METADATA: IPageMetadata[] = [
  {
    title: TITLE_PREFIX + 'About Us',
    description: 'About FreeBoardGame.org, a free and open-source software project.',
    url: new RegExp('^/about', 'i'),
  },
];

function getGamesPageMetadata(): IPageMetadata[] {
  return GAMES_LIST.map((gameDef) =>
    ({
      title: TITLE_PREFIX + `Play Free ${gameDef.name} Online`,
      description: gameDef.descriptionTag,
      url: new RegExp(`^/g/${gameDef.code}`, 'i'),
    }));
}

/** Given a URL, gets its title. */
export const getPageMetadata = (url: string): IPageMetadata => {
  const allPagesMetadata = [...PAGES_METADATA, ...getGamesPageMetadata()];
  const metadata = allPagesMetadata.find((meta) => meta.url!.test(url));
  if (!metadata) {
    return DEFAULT_METADATA;
  }
  return metadata;
};
