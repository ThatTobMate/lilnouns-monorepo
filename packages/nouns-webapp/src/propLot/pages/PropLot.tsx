import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import PropLotHome from './PropLotHome';
import classes from '../style/Ideas.module.css';

const IdeasPage = () => {
  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>Prop Lot</span>
          <h1>Submissions</h1>
        </Row>
        <PropLotHome />
      </Col>
    </Section>
  );
};
export default IdeasPage;
