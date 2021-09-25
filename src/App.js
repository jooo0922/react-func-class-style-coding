import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [funcShow, setFuncShow] = useState(true);
  const [classShow, setClassShow] = useState(true);

  return (
    <div className="container">
      <h1>Hello world</h1>
      <input
        type="button"
        value="remove func"
        onClick={function () {
          setFuncShow(false);
        }}
      />
      <input
        type="button"
        value="remove class"
        onClick={function () {
          setClassShow(false);
        }}
      />
      {funcShow ? <FuncComp initNumber={2}></FuncComp> : null}
      {classShow ? <ClassComp initNumber={2}></ClassComp> : null}
    </div>
  );
}

const funcStyle = "color:blue";
let funcId = 0;
function FuncComp(props) {
  const numberState = useState(props.initNumber);
  const number = numberState[0];
  const setNumber = numberState[1];

  // const dateState = useState(new Date().toString()); // 새로운 상태값을 추가하려면 useState를 한번 더 써주면 됨
  // const _date = dateState[0];
  // const setDate = dateState[1];

  // Destructuring Assignment 문법을 이용해서 위의 세 줄을 간단하게 한 줄로 표현하는 것도 가능. ellie js 개념 필기 참고
  const [_date, setDate] = useState(new Date().toString());

  // side effect
  useEffect(
    function () {
      console.log(
        "%cfunc => useEffect number (componentDidMount & componentDidUpdate) " +
          funcId,
        funcStyle
      );
      document.title = number; // 이거는 해당 컴포넌트와 아무 상관없는 title element를 예외적으로 바꾼 것! -> side effect

      // 이전에 실행했던 작업을 정리할 때 호출되는 cleanup 함수
      return function () {
        console.log(
          "%cfunc => useEffect number return (componentDidMount & componentDidUpdate) " +
            funcId,
          funcStyle
        );
      };
    },
    [number]
  );

  useEffect(
    function () {
      console.log(
        "%cfunc => useEffect _date (componentDidMount & componentDidUpdate) " +
          funcId,
        funcStyle
      );
      document.title = _date; // 이거는 해당 컴포넌트와 아무 상관없는 title element를 예외적으로 바꾼 것! -> side effect

      return function () {
        console.log(
          "%cfunc => useEffect _date return (componentDidMount & componentDidUpdate) " +
            funcId,
          funcStyle
        );
      };
    },
    [_date]
  );

  // 만약 useEffect를 이용해서 'componentDidMount의 역할만' 하게 하려면 어떻게 해야 할까?
  useEffect(function () {
    console.log(
      "%cfunc => useEffect number (componentDidMount) " + funcId,
      funcStyle
    );
    document.title = number; // 이거는 해당 컴포넌트와 아무 상관없는 title element를 예외적으로 바꾼 것! -> side effect

    // 이전에 실행했던 작업을 정리할 때 호출되는 cleanup 함수
    // 여기의 cleanup 함수는 부모 컴포넌트인 App에서 버튼 클릭에 의해 컴포넌트가 DOM UI에서 퇴장할 때, 소멸할 때 호출됨
    return function () {
      console.log(
        "%cfunc => useEffect return (componentWillUnmount) " + funcId,
        funcStyle
      );
    };
  }, []); // 두번째 인자로 빈 배열만 전달하면, 첫 번째에만 실행되고, 그 이후부터는 실행 안됨. -> componentDidMount의 기능만 하게 되는 셈!

  console.log("%cfunc => render " + ++funcId, funcStyle); // 강의 영상과는 다르게 ++funcId를 한 번만 호출하면 이후 console.log에서 funcId만 써줘도 계속 1이 더해져서 찍히는 듯.
  return (
    <div className="container">
      <h2>funtional style component</h2>
      <p>Number : {number}</p>
      <p>Date : {_date}</p>
      <input
        type="button"
        value="random"
        onClick={function () {
          setNumber(Math.random());
        }}
      />
      <input
        type="button"
        value="date"
        onClick={function () {
          setDate(new Date().toString());
        }}
      />
    </div>
  );
}

const classStyle = "color:red";
class ClassComp extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     number: this.props.initNumber,
  //   };
  // } 원래는 이렇게 생성자 안에 state를 정의해야 되는데 아래처럼 해도 되는 것 같음...
  state = {
    number: this.props.initNumber,
    date: new Date().toString(),
  };

  componentWillMount() {
    console.log("%cclass => componentWillMount", classStyle);
  }

  componentDidMount() {
    console.log("%cclass => componentDidMount", classStyle);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("%cclass => shouldComponentUpdate", classStyle);
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("%cclass => componentWillUpdate", classStyle);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("%cclass => componentDidUpdate", classStyle);
  }

  componentWillUnmount() {
    console.log("%cclass => componentWillUnmount", classStyle);
  }

  render() {
    console.log("%cclass => render", classStyle);
    return (
      <div className="container">
        <h2>class style component</h2>
        <p>Number : {this.state.number}</p>
        <p>Date: {this.state.date}</p>
        <input
          type="button"
          value="random"
          onClick={function () {
            this.setState({ number: Math.random() });
          }.bind(this)}
        />
        <input
          type="button"
          value="date"
          onClick={function () {
            this.setState({ date: new Date().toString() });
          }.bind(this)}
        />
      </div>
    );
  }
}

export default App;

/**
 * Function style component 내부에서 props에 접근하려면
 * 해당 함수의 첫번째 인자로 전달받는 값을 사용하면 됨!
 */

/**
 * Function style component 에서 state를 사용하는 방법: 'useState'
 *
 * 리액트가 제공하는 Hook 중 하나인 useState는 함수 컴포넌트에서 state를 사용할 수 있게 해준다.
 *
 * const numberState = useState(props.initNumber);
 * const number = numberState[0];
 * const setNumber = numberState[1];
 * 위에 처럼 useState를 호출하면 어떤 배열을 리턴받게 됨.
 *
 * 이 배열의 첫 번째 값은 '상태값'
 * 클래스 컴포넌트로 치면 생성자에 초기 상태값을 지정하는 것과 같은 역할.
 * 단, useState(초기 상태값) 이렇게 호출 시 첫 번째 인자로 넘겨주는 식으로 지정함.
 * 아무것도 지정하지 않으면 undefined 상태가 되어있음.
 *
 * 두 번째 값은 '상태값을 바꿔주는 함수'
 * 클래스 컴포넌트로 치면 setState()와 동일한 역할.
 * 단, setNumber(바꿔주려는 값) 이렇게 호출 시 첫 번째 인자로 넘겨주는 식으로 값을 바꿈.
 * 또한, 함수 컴포넌트는 클래스가 아니므로, this를 바인딩하지 않아도 됨.
 *
 * 클래스 컴포넌트는 state를 추가할 때마다 하나의 객체 안에 넣어야 하는데
 * 함수 컴포넌트는 state를 추가할 때마다 useState를 반복해서 사용하면 됨.
 */

/**
 * 클래스 컴포넌트 라이프사이클 구현
 *
 * 리액트의 클래스 스타일 컴포넌트에서는
 * 컴포넌트가 그려지기 전/후 또는 컴포넌트 업데이트 전/후 등
 * 특정 타이밍에 원하는 코드를 수행할 수 있도록 정해진 이름의 메서드에 원하는 내용을 정의할 수 있도록 해줌.
 *
 * 위에서 작성한 componentWillMount, componentDidMount, shouldComponentUpdate, componentWillUpdate, componentDidUpdate
 * 등의 메서드가 예시이며 이를 통해서 원하는 타이밍에 원하는 작업을 수행하도록 하는 것을
 * '컴포넌트의 라이프 사이클을 구현'한다고 함.
 *
 * 원래 이게 클래스 컴포넌트에서만 가능하고 함수 컴포넌트에서는 불가능했는데,
 * 최신 리액트에서는 함수 컴포넌트에서도 가능해졌다는 것!
 */

/**
 * 함수 컴포넌트 라이프사이클 구현
 *
 * 함수 스타일 컴포넌트에서는 원래 라이프사이클 구현이 불가능했으나,
 * 최신 리액트에서 다양한 Hook이 추가되면서 구현이 가능해졌다.
 *
 *
 * 1. useEffect
 *
 * 함수(클래스 컴포넌트에서 render 메서드에 대응)의 맨 처음 호출된 다음,
 * 또 함수가 다시 호출된 다음 useEffect에 넣은 첫 번째 인자 함수를 호출시킴
 * 클래스 라이프사이클에서 componentDidMount, componentDidUpdate에 해당.
 * 저 effect는 'side effect'의 줄임말. 즉, '부가적인 작용' 이라는 뜻.
 * 즉, FuncComp라는 함수 컴포넌트가 호출됬을때 리턴되는 결과, 즉 DOM UI를 그려주는 것이 main effect 즉, 주 임무인 것이고,
 * 그 외에 주 임무에서 벗어나는 작업들이 side effect가 되겠지!
 * 또한 useEffect는 하나의 컴포넌트에 대해 여러 개 설치하는 것이 가능하다.
 *
 * 1-1. clean up 리턴함수
 *
 * 클래스 컴포넌트의 라이프사이클에서,
 * componentWillMount -> render -> componentDidMount로 해당 컴포넌트의 UI가 최초로 그려진 뒤에,
 * 다시 render 함수가 호출되어 컴포넌트를 업데이트할 때,
 * 이전에 그려진 컴포넌트 UI가 퇴장, 즉 소멸하게 되는데 이때 어떠한 작업을 해야하는 경우
 * 'componentWillUnmount()' 메서드를 호출하면 됨.
 *
 * 함수 컴포넌트의 라이프사이클에서 이와 비슷한 작업을 해주려면,
 * useEffect의 첫 번째 인자 함수 내에서 'cleanup 함수를 리턴' 해줘야 함.
 * 이렇게 하면 useEffect에 넣어놓은 함수가 최초 실행 후 다시 실행될 때
 * 이전에 실행했던 것을 정리할 때 return값에 있는 함수가 호출되도록 약속되어 있음!
 */

/**
 * 1. Optimizing Performance by Skipping Effects
 *
 * 클래스 컴포넌트의 componentDidUpdate(prevProps, prevState) 메서드는
 * 컴포넌트가 변경되었을 때 실행되긴 하는데, 딱히 state값이 변경되지 않아도 실행된다면 성능 낭비겠지?
 *
 * 그래서 아래와 같이 이전 state와 현재 state가 다를 경우에만, 즉, state가 변경되었을 때에만
 * 내부의 코드를 실행하도록 한다면, state가 변경되지 않았을 때 불필요하게 코드를 실행하지 않아도 될거임.
 * if (prevState.~~ !== this.state.~~) {
 *
 * }
 *
 * 이와 같은 트릭을 Skipping Effect, 즉 이펙트를 생략한다고 함.
 *
 *
 * 2. 그렇다면 함수 컴포넌트의 useEffect(componentDidUpdate와 동일한 기능)에서는 어떻게 구현할 수 있을까?
 *
 * useEffect(function() {}, [감시하려는 state 값(들)]);
 *
 * 위와 같이 사용하면, 두번째 인자로 전달된 배열 안에 state값들을 useEffect가 감시하게 됨.
 * 그래서 해당 state값들이 바뀌면 첫번째 인자로 넣은 함수를 호출하고, 바뀌지 않으면 호출하지 않는 방식!
 *
 * 이렇게 함으로써 감시 대상이 되는 state 값이 변경되지 않았을 때 불필요하게 함수를 호출하지 않도록 함.
 *
 * 그렇다면, 첫번째 함수 안에서 return 하는 cleanup 함수는 어떻게 되는걸까?
 * 클래스 컴포넌트에서 componentDidUpdate가 되기 전에 componentWillUnmount가 호출되어 이전 컴포넌트를 지우는 것처럼,
 * useEffect에도 cleanup 함수가 먼저 호출되어야 하기 때문에
 * 만약에 감시 대상 state가 변경되서 첫번째 함수를 호출하면,
 * 리턴받는 cleanup 함수를 먼저 실행한 다음 첫번째 함수를 실행하게 될거임!
 * 반대로 state가 변경되지 않으면, 첫번째 함수가 호출되지 않기 때문에,
 * cleanup 함수와 첫번째 함수 둘 다 실행되지 않게 됨!
 */
