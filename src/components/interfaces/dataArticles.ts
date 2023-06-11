import Articles from './article';

export default interface Data extends Object {
    status: string;
    totalResults: number;
    articles: Array<Articles>;
    sources: Array<Articles>;
}
