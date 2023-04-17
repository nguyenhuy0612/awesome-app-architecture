import 'package:flutter/material.dart';
import 'package:flutter_web_navigation/presentation/components/qna/qna_form.dart';
import '../../../../utils/images.dart';

class HomeRightPanel extends StatelessWidget {
  final String sectionName;
  final String description;
  final String subDecription;

  const HomeRightPanel({
    Key? key,
    required this.sectionName,
    required this.description,
    required this.subDecription,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Expanded(
        flex: 6,
        child: Container(
          margin: const EdgeInsets.fromLTRB(20, 20, 100, 70),
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: Colors.white.withOpacity(0.9),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10.0,
                  spreadRadius: 8,
                  offset: const Offset(
                    5.0,
                    5.0,
                  ),
                ),
              ]),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            // ignore: prefer_const_literals_to_create_immutables
            children: [
              const SizedBox(
                height: 50,
              ),
              const QnaForm(),
              // Image.asset(AllImages.flutterLogo, width: 300, height: 300),
              // const SizedBox(
              //   height: 30,
              // ),
              // Text(
              //   sectionName,
              //   style: const TextStyle(
              //       fontSize: 40,
              //       fontWeight: FontWeight.w900,
              //       color: Colors.blueGrey),
              //   textAlign: TextAlign.center,
              // ),
              // const SizedBox(
              //   height: 30,
              // ),
              // Text(
              //   description,
              //   style:
              //       const TextStyle(fontSize: 30, fontWeight: FontWeight.w700),
              //   textAlign: TextAlign.center,
              // ),
              // InkWell(
              //     onTap: () {},
              //     child: Text(
              //       subDecription,
              //       style: TextStyle(fontSize: 18, color: Colors.green[900]),
              //       textAlign: TextAlign.center,
              //     )),
            ],
          ),
        ));
  }
}
