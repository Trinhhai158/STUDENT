import styles from './Content.module.scss';

import classNames from 'classnames/bind';
import StudentForm from './StudentForm';
import StudentList from './StudentList';
const cx = classNames.bind(styles);

function Content() {
  return (
    <div className={cx('Content')}>
      <StudentForm />
      <StudentList />
    </div>
  );
}

export default Content;
