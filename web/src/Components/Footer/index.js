import twitterLogo from 'assets/twitter-logo.svg';
import githubLogo from 'assets/GitHub-Mark-32px.png';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const GITHUB_LINK = 'https://github.com/birdglove2/turn-based-nft-card-game';

export const Footer = () => {
  return (
    <div className="relative bottom-0 mt-[200px] h-[100px]">
      <div className="flex flex-col justify-center items-center">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={GITHUB_LINK}
          className="flex justify-center items-center"
        >
          <img alt="Github Logo" className="w-9 h-9 mr-2" src={githubLogo} />
          <p className="text-sm font-bold">visit the code</p>
        </a>

        <div className="flex justify-center items-center">
          <img alt="Twitter Logo" className="w-9 h-9" src={twitterLogo} />
          <a
            className="text-sm font-bold"
            href={TWITTER_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};
