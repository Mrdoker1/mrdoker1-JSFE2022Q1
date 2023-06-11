import Source from './source';

export default interface DataSources extends Object {
    sources: Array<Source>;
    status: string;
}
