import './sources.scss';
import Source from '../../interfaces/source';

class Sources {
    draw(data: Array<Source>) {
        const fragment = document.createDocumentFragment() as DocumentFragment;

        const sourceItemTemp: HTMLTemplateElement = document.querySelector('#sourceItemTemp')!;

        data.forEach((item) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true) as HTMLElement;

            sourceClone.querySelector('.source__item-name')!.textContent = item.name;
            sourceClone.querySelector('.source__item')!.setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });

        document.querySelectorAll('.sources')!.forEach((element) => {
            element.append(fragment.cloneNode(true));
        });
    }
}

export default Sources;
