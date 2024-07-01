import {IConstruct} from "constructs";
import {Tags} from "aws-cdk-lib";

export function applyTags({resource, resourceName, stackName, tags}: {
  resource: IConstruct,
  resourceName: string,
  stackName: string,
  tags: { [p: string]: string }
}): void {
  Object.entries(tags).forEach(([key, value]): void => {
    Tags.of(resource).add(key, value);
  });
  Tags.of(resource).add('Name', `${stackName}/${resourceName}`);
  Tags.of(resource).add('Service', resourceName);
}