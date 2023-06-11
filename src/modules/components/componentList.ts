/* Components */
import Component from '../components/component';
import ProductComponent from '../components/product';
import HeaderComponent from '../components/header';
import FooterComponent from '../components/footer';
import CatalogComponent from '../components/catalog';
import LanguageSwitcherComponent from '../components/language-switcher';
import H1Component from '../components/h1';
import BreadcrumbsComponent from '../components/breadcrumbs';
import NavigationComponent from '../components/navigation';
import FiltersComponent from '../components/filters';
import FilterComponent from '../components/filters/filter';
import RangeFilterComponent from '../components/filters/rangeFilter';
import SearchComponent from '../components/search';

export default function componentList(componentName: string) {
    switch (componentName) {
        case 'header':
            return new HeaderComponent().getNode();
        case 'footer':
            return new FooterComponent().getNode();
        case 'catalog':
            //return new CatalogComponent().getNode();
        case 'navigation':
            return new NavigationComponent().getNode();
        case 'filters':
            return new FiltersComponent().getNode();
        case 'language-switcher':
        // return new LanguageSwitcherComponent().getNode();
        case 'product':
        //return new ProductComponent().getComponent();
        case 'h1':
            return new H1Component().getNode();
        case 'breadcrumbs':
            return new BreadcrumbsComponent().getNode();
        case 'material-filter':
            return new FilterComponent('material').getNode();
        case 'gender-filter':
            return new FilterComponent('gender').getNode();
        case 'stock-filter':
            return new FilterComponent('stock').getNode();
        case 'type-filter':
            return new FilterComponent('type').getNode();
        case 'price-filter':
            return new RangeFilterComponent().getNode();
        case 'search':
            return new SearchComponent().getNode();
        default:
            return new Component().getNode();
    }
}
