import News from './news/news';
import Sources from './sources/sources';
import Data from '../interfaces/dataArticles';
import Article from '../interfaces/article';
import DataSource from '../interfaces/dataSources';
import Source from '../interfaces/source';

export class AppView {
    news: News;
    sources: Sources;
    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: Data) {
        const values: Array<Article> = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    drawSources(data: DataSource) {
        const values: Array<Source> = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
